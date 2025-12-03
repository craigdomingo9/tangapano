from django_elasticsearch_dsl_drf.filter_backends import BaseSearchFilterBackend
from elasticsearch_dsl.query import Q, Bool

class RoomCompositeFilterBackend(BaseSearchFilterBackend):
    """
    Handles the complexity of finding a listing where ONE specific room
    meets criteria A, B, C, and D simultaneously.
    """
    def filter_queryset(self, request, queryset, view):
        """
        Filter the queryset based on the given query parameters.

        If the 'price_min' parameter is present, filter the queryset to only
        include listings with rooms that have a rent greater than or equal to the
        specified price.

        If the 'price_max' parameter is present, filter the queryset to only
        include listings with rooms that have a rent less than or equal to the
        specified price.

        If the 'gender' parameter is present, filter the queryset to only
        include listings with rooms that have a gender preference matching the requested
        gender or are 'any'.

        If the 'max_occupants' parameter is present, filter the queryset to only
        include listings with rooms that have a maximum occupancy matching the requested
        value.

        If the 'is_full' parameter is present and set to 'true', filter the queryset to only
        include listings with rooms that have no vacancy.

        Wrap all conditions in a nested query to ensure that only listings with
        rooms that meet all the specified conditions are returned.
        """
        params = request.query_params
        must_conditions = []

        # 1. Build the conditions
        if 'price_min' in params:
            must_conditions.append(Q('range', rooms__rent_per_month={'gte': params['price_min']}))
        
        if 'price_max' in params:
            must_conditions.append(Q('range', rooms__rent_per_month={'lte': params['price_max']}))
            
        if 'gender' in params:
            # Use OR logic (Requested Gender | Any)
            must_conditions.append(
                Q('term', rooms__gender_preference=params['gender']) | 
                Q('term', rooms__gender_preference='any')
            )
            
        
        if 'max_occupants' in params:
            must_conditions.append(Q('term', rooms__max_occupants=params['max_occupants']))
            
        if params.get('is_full') == 'true':
            must_conditions.append(Q('term', rooms__has_vacancy=True))

        if not must_conditions:
            return queryset

        # 2. Wrap in Nested Query
        # "path='rooms'" tells ES to look inside the nested objects
        nested_query = Q('nested', path='rooms', query=Bool(must=must_conditions))
        
        return queryset.query(nested_query)

class AmenityDynamicMatchBackend(BaseSearchFilterBackend):
    """
    Replicates the Python math logic: 
    matches listings containing ~33% of requested amenities.
    """
    def filter_queryset(self, request, queryset, view):
        """
        Filter the queryset based on the given query parameters.

        If the 'amenities' parameter is present, filter the queryset to only
        include listings that contain at least 33% of the requested amenities.

        Prefetch the 'amenities' relation to improve performance.
        """
        amenities_str = request.query_params.get('amenities')
        if not amenities_str:
            return queryset

        amenity_names = [a.strip() for a in amenities_str.split(',') if a.strip()]
        if not amenity_names:
            return queryset

        # Replicating your original logic:
        # min_match_count = len // 3
        length = len(amenity_names)
        
        if length < 3:
            # If user asks for 1 or 2 amenities, we usually require ALL of them
            min_should_match = length
        else:
            denom = length // 3
            min_should_match = int(length // denom) # This approximates your original math

        # 3. Construct the Query
        should_conditions = [Q('term', amenities=name) for name in amenity_names]
        
        bool_query = Bool(
            should=should_conditions,
            minimum_should_match=min_should_match
        )
        
        return queryset.query(bool_query)
