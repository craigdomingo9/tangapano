# listings/views/listing_views.py
import math
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from listings.documents import ListingDocument
from listings.serializers import ListingDocumentSerializer
from listings.pagination import StandardResultsSetPagination

class ListingSearchAPIView(APIView):
    
    def get(self, request, *args, **kwargs):
        params = request.query_params
        
        # --- 1. BUILD QUERY (Raw Dict Mode) ---
        must_clauses = [{"match_all": {}}] 

        # A. Location Filters (Fixed Field Names)
        if params.get('campus'):
            must_clauses.append({"term": {"campus_id": params['campus']}})
        
        if params.get('neighborhood'):
            must_clauses.append({"term": {"neighborhood_id": params['neighborhood']}})

        # B. Amenities (33% Match Logic)
        amenities_str = params.get('amenities')
        if amenities_str:
            names = [a.strip().lower() for a in amenities_str.split(',') if a.strip()]
            if names:
                min_match = len(names) if len(names) < 3 else math.ceil(len(names) * 0.33)
                should_clauses = [{"term": {"amenity_names": name}} for name in names]
                must_clauses.append({
                    "bool": {
                        "should": should_clauses,
                        "minimum_should_match": min_match
                    }
                })

        # C. Room Filters (Nested)
        room_must_clauses = []

        if params.get('price_min'):
            room_must_clauses.append({"range": {"rooms.rent_value": {"gte": float(params['price_min'])}}})
        if params.get('price_max'):
            room_must_clauses.append({"range": {"rooms.rent_value": {"lte": float(params['price_max'])}}})

        # Gender (Optimized Index Field)
        if params.get('gender'):
            room_must_clauses.append({"term": {"rooms.searchable_genders": params['gender'].lower()}})

        # Max Occupants
        if params.get('max_occupants'):
            room_must_clauses.append({"term": {"rooms.max_occupants": int(params['max_occupants'])}})

        # Vacancy Logic (Standard UX)
        if params.get('is_full') == 'true':
            # User wants to see full rooms
            room_must_clauses.append({"term": {"rooms.is_full": True}})
        else:
            # Default: HIDE full rooms (ensure vacancy)
            room_must_clauses.append({"term": {"rooms.has_vacancy": True}})

        # Apply Nested Query
        if room_must_clauses:
            must_clauses.append({
                "nested": {
                    "path": "rooms",
                    "query": {
                        "bool": {
                            "must": room_must_clauses
                        }
                    }
                }
            })

        # --- 2. EXECUTE ---
        query_body = {"query": {"bool": {"must": must_clauses}}}
        
        s = ListingDocument.search()
        s.update_from_dict(query_body)
        s = s.sort('-created_at') # Newest first

        paginator = StandardResultsSetPagination()
        page_size = paginator.get_page_size(request)
        page_number = int(params.get('page', 1))
        
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

    def get_next_link(self, request, current_page, total_count, page_size):
        if current_page * page_size >= total_count: return None
        return request.build_absolute_uri(f"?page={current_page + 1}")

    def get_previous_link(self, request, current_page):
        if current_page <= 1: return None
        return request.build_absolute_uri(f"?page={current_page - 1}")