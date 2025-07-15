from django_filters import rest_framework as filters
from listings.models import Listing, Room
from django.db.models import Q, Count, Prefetch, OuterRef, Exists



class ListingFilter(filters.FilterSet):
    campus = filters.CharFilter(field_name='campus')
    neighborhood = filters.CharFilter(field_name='neighborhood')
    price_min = filters.NumberFilter(field_name='rooms__rent_per_month', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='rooms__rent_per_month', lookup_expr='lte')
    gender = filters.CharFilter(method='filter_gender', label='Gender')
    max_occupants = filters.NumberFilter(field_name='rooms__max_occupancy', lookup_expr='lte')
    is_available = filters.BooleanFilter(field_name='rooms__is_available')
    amenities = filters.CharFilter(method='filter_amenities')
    
    class Meta:
        model = Listing
        fields = []
    
    def filter_gender(self, queryset, name, value):
        if value == 'any':
            return queryset
        return queryset.filter(rooms__gender_preference=value)
    
    
    def filter_amenities(self, queryset, name, value):
        amenity_names = [a.strip() for a in value.split(',') if a.strip()]
    
        # Filter by amenity
        if amenity_names:
            q_objects = Q()
            for name in amenity_names:
                q_objects |= Q(amenities__amenity__name__exact=name)
            
            min_match_count = len(amenity_names) // 2
            queryset = queryset.annotate(
                match_count=Count('amenities', filter=q_objects)
            ).filter(match_count__gte=min_match_count).order_by('-match_count').distinct()
        
        return queryset
    
    def filter_queryset(self, queryset):
        # Extract request parameters
        params = self.request.query_params

        price_min = params.get('price_min')
        price_max = params.get('price_max')
        gender = params.get('gender')
        max_occupants = params.get('max_occupants')
        is_available = params.get('is_available')

        # Build Q filters for rooms
        room_filter = Q(is_available=True)
        if price_min:
            room_filter &= Q(rent_per_month__gte=price_min)
        if price_max:
            room_filter &= Q(rent_per_month__lte=price_max)
        if gender and gender != 'any':
            room_filter &= Q(gender_preference=gender)
        if max_occupants:
            room_filter &= Q(max_occupancy__lte=max_occupants)
        if is_available:
            room_filter &= Q(is_available=True)
            
        # ✅ Only include listings where such rooms exist
        matching_rooms = Room.objects.filter(
            listing=OuterRef("pk")
        ).filter(room_filter)

        queryset = queryset.annotate(
            has_matching_rooms=Exists(matching_rooms)
        ).filter(has_matching_rooms=True)

        # Apply filtered prefetch
        queryset = queryset.prefetch_related(
            Prefetch('rooms', queryset=Room.objects.filter(room_filter))
        )

        # ✅ Exclude listings that will have zero rooms after filtering
        queryset = queryset.annotate(filtered_room_count=Count('rooms')).exclude(filtered_room_count=0)

        return super().filter_queryset(queryset)


