from rest_framework.views import APIView
from rest_framework.response import Response
from elasticsearch_dsl import Q
from listings.documents import ListingDocument
from listings.serializers import ListingDocumentSerializer
from listings.pagination import StandardResultsSetPagination

class ListingSearchAPIView(APIView):
    
    def get(self, request, *args, **kwargs):
        s = ListingDocument.search()
        params = request.query_params

        # --- THE FIX: Collect raw Dicts, not Q Objects ---
        # We will append .to_dict() versions of queries here.
        # This prevents "unhashable" errors because we aren't asking 
        # the library to deduplicate Python objects.
        must_clauses = []

        # 1. Campus Filter
        if params.get('campus') and params.get('campus').strip().isdigit():
            q = Q('term', campus_filter_id=int(params['campus']))
            must_clauses.append(q.to_dict())
        
        # 2. Neighborhood Filter
        if params.get('neighborhood') and params.get('neighborhood').strip().isdigit():
            q = Q('term', neighborhood_filter_id=int(params['neighborhood']))
            must_clauses.append(q.to_dict())

        # 3. Room Filters (Nested Logic)
        room_dict = self._build_room_dict(params)
        if room_dict:
            must_clauses.append(room_dict)

        # 4. Amenity Filters (Bool/Should Logic)
        amenity_dict = self._build_amenity_dict(params)
        if amenity_dict:
            must_clauses.append(amenity_dict)

        # --- EXECUTION ---
        # We construct one master BOOL query using the raw list
        if must_clauses:
            s = s.query('bool', must=must_clauses)

        # --- Sorting & Pagination ---
        s = s.sort('-id')
        
        paginator = StandardResultsSetPagination()
        page_size = paginator.get_page_size(request)
        page_number = int(request.query_params.get('page', 1))
        
        start = (page_number - 1) * page_size
        end = start + page_size

        s = s[start:end]

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

    def _build_room_dict(self, params):
        """
        Returns a DICTIONARY (not Q object) for room filters.
        """
        must_rules = []
        
        # Price
        if 'price_min' in params:
            must_rules.append(Q('range', rooms__rent_value={'gte': params['price_min']}))
        if 'price_max' in params:
            must_rules.append(Q('range', rooms__rent_value={'lte': params['price_max']}))
            
        # Gender Logic:
        # 1. Matches the requested gender exactly (e.g., "Female" -> "Female")
        # OR
        # 2. Is marked "Any" AND is currently empty (current_occupants=0)
        #    (An empty "Any" room is safe for anyone. A populated "Any" room implies a gender is already established.)
        if 'gender' in params:
            exact_match = Q('term', rooms__gender_preference=params['gender'])
            
            any_empty_match = (
                Q('term', rooms__gender_preference='any') & 
                Q('term', rooms__current_occupants=0)
            )
            
            # Combine with OR (|)
            gender_q = exact_match | any_empty_match
            
            must_rules.append(gender_q)
            
        # Occupancy
        if 'max_occupants' in params:
            must_rules.append(Q('term', rooms__max_occupants=params['max_occupants']))
            
        # Vacancy
        if params.get('is_full') == 'true':
             must_rules.append(Q('term', rooms__is_full=True))
        else:
             must_rules.append(Q('term', rooms__has_vacancy=True))

        if must_rules:
            # 1. Combine all inner rules into one Q object
            combined = must_rules[0]
            for rule in must_rules[1:]:
                combined = combined & rule
            
            # 2. Wrap in Nested
            nested_q = Q('nested', path='rooms', query=combined)
            
            # 3. Return as Dict
            return nested_q.to_dict()
            
        return None

    def _build_amenity_dict(self, params):
        """
        Returns a DICTIONARY for amenity filters.
        """
        amenities_str = params.get('amenities')
        if not amenities_str: return None
        
        names = [a.strip().lower() for a in amenities_str.split(',') if a.strip()]
        if not names: return None

        length = len(names)
        if length < 3:
            min_should_match = length
        else:
            denom = length // 3
            min_should_match = int(length // denom)

        # Convert Terms to dicts immediately to be safe
        should_conditions = [Q('term', amenity_filter_names=name).to_dict() for name in names]
        
        # Construct the Bool query and return as dict
        q = Q('bool', should=should_conditions, minimum_should_match=min_should_match)
        return q.to_dict()

    # --- Links ---
    def get_next_link(self, request, current_page, total_count, page_size):
        if current_page * page_size >= total_count:
            return None
        return request.build_absolute_uri(f"?page={current_page + 1}")

    def get_previous_link(self, request, current_page):
        if current_page <= 1:
            return None
        return request.build_absolute_uri(f"?page={current_page - 1}")