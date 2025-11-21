from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from elasticsearch_dsl import Q
from listings.documents import ListingDocument
from listings.serializers import ListingDocumentSerializer
from listings.pagination import StandardResultsSetPagination

class ListingSearchAPIView(APIView):
    
    def get(self, request, *args, **kwargs):
        s = ListingDocument.search()
        params = request.query_params

        # 1. Filter by Campus (Use hidden ID field)
        if params.get('campus') and params.get('campus').strip().isdigit():
            s = s.filter('term', campus_filter_id=int(params['campus']))
        
        # 2. Filter by Neighborhood (Use hidden ID field)
        if params.get('neighborhood') and params.get('neighborhood').strip().isdigit():
            s = s.filter('term', neighborhood_filter_id=int(params['neighborhood']))

        # 3. Apply other filters
        s = self.apply_room_filters(s, params)
        s = self.apply_amenity_filters(s, params)

        # --- Sorting & Pagination ---
        s = s.sort('-id')
        
        paginator = StandardResultsSetPagination()
        page_size = paginator.get_page_size(request)
        page_number = int(request.query_params.get('page', 1))
        
        start = (page_number - 1) * page_size
        end = start + page_size

        s = s[start:end]

        # --- Execute ---
        response = s.execute()

        serializer = ListingDocumentSerializer(
            response.hits, 
            many=True,
            context={'request': request}
        )
        
        return Response({
            'count': response.hits.total.value,
            'next': self.get_next_link(request, page_number, response.hits.total.value, page_size),
            'previous': self.get_previous_link(request, page_number),
            'results': serializer.data
        })

    def apply_room_filters(self, search, params):
        must_conditions = []
        
        if 'price_min' in params:
            must_conditions.append(Q('range', rooms__rent_value={'gte': params['price_min']}))
            
        if 'price_max' in params:
            must_conditions.append(Q('range', rooms__rent_value={'lte': params['price_max']}))
            
        if 'gender' in params:
            must_conditions.append(Q('term', rooms__gender_preference=params['gender']))
            
        if 'max_occupants' in params:
            must_conditions.append(Q('term', rooms__max_occupants=params['max_occupants']))
            
        if params.get('is_full') == 'true':
            must_conditions.append(Q('term', rooms__has_vacancy=True))

        if must_conditions:
            # Use to_dict() to avoid unhashable error
            inner = Q('bool', must=must_conditions)
            nested = Q('nested', path='rooms', query=inner)
            return search.query(nested.to_dict())
        return search

    def apply_amenity_filters(self, search, params):
        amenities_str = params.get('amenities')
        if not amenities_str: return search
        
        # UPDATE: Use 'amenity_filter_names' for searching
        names = [a.strip().lower() for a in amenities_str.split(',') if a.strip()]
        
        if not names:
            return search

        length = len(names)
        if length < 3:
            min_should_match = length
        else:
            denom = length // 3
            min_should_match = int(length // denom)

        should_conditions = [Q('term', amenity_filter_names=name) for name in names]
        
        q = Q('bool', should=should_conditions, minimum_should_match=min_should_match)
        
        return search.query(q.to_dict())

    def get_next_link(self, request, current_page, total_count, page_size):
        if current_page * page_size >= total_count:
            return None
        return request.build_absolute_uri(f"?page={current_page + 1}")

    def get_previous_link(self, request, current_page):
        if current_page <= 1:
            return None
        return request.build_absolute_uri(f"?page={current_page - 1}")

