from django_filters import rest_framework as filters
from listings.models import Listing, Room, Amenity
from django.db.models.functions import Coalesce
from django.db.models import (
    Count, 
    Subquery, 
    OuterRef, 
    Q, 
    Count, 
    Prefetch, 
    OuterRef, 
    Exists, 
    F
)


class ListingFilter(filters.FilterSet):
    campus = filters.CharFilter(field_name='campus')
    neighborhood = filters.CharFilter(field_name='neighborhood')
    price_min = filters.NumberFilter(field_name='rooms__rent_per_month', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='rooms__rent_per_month', lookup_expr='lte')
    gender = filters.CharFilter(method='filter_gender', label='Gender')
    max_occupants = filters.NumberFilter(field_name='rooms__max_occupants')
    is_full = filters.BooleanFilter(method='filter_is_full')
    amenities = filters.CharFilter(method='filter_amenities')
    
    class Meta:
        model = Listing
        fields = []
    
    def filter_is_full(self, queryset, name, value):
        if value:
            return queryset.filter(rooms__current_occupants__lt=F('max_occupants'))
        return queryset
    
    def filter_gender(self, queryset, name, value):
        return queryset.filter(rooms__gender_preference=value)
    
    def filter_amenities(self, queryset, name, value):
        amenity_names = {a.strip() for a in value.split(',') if a.strip()}
        if not amenity_names:
            return queryset
        
        # Get amenities in single query
        amenities = Amenity.objects.filter(name__in=amenity_names)
        if not amenities.exists():
            return queryset.none()

        min_match_count = len(amenity_names) // 2

        # Create direct subquery for matching counts
        return queryset.filter(
            amenities__in=amenities
        ).annotate(
            match_count=Count('amenities')
        ).filter(
            match_count__gte=len(amenity_names) // 2
        ).order_by('-match_count')


    def filter_queryset(self, queryset):
        # Extract request parameters
        params = self.request.query_params

        price_min = params.get('price_min')
        price_max = params.get('price_max')
        gender = params.get('gender')
        max_occupants = params.get('max_occupants')
        is_full = params.get('is_full')

        # Build Q filters for rooms
        room_filter = Q()
        if price_min:
            room_filter &= Q(rent_per_month__gte=price_min)
        if price_max:
            room_filter &= Q(rent_per_month__lte=price_max)
        if gender:
            room_filter &= Q(gender_preference=gender)
        if max_occupants:
            room_filter &= Q(max_occupants=max_occupants)
        if is_full:
            room_filter &= Q(current_occupants__lt=F('max_occupants'))

        # ✅ Only include listings where such rooms exist
        matching_rooms = Room.objects.filter(
            listing=OuterRef("pk")
        ).filter(room_filter)

        queryset = queryset.annotate(
            has_matching_rooms=Exists(matching_rooms)
        ).filter(has_matching_rooms=True)


        # Apply filtered prefetch
        queryset = queryset.prefetch_related(
            Prefetch('rooms', queryset=Room.objects.filter(room_filter).order_by('rent_per_month'))
        )

        # ✅ Exclude listings that will have zero rooms after filtering
        queryset = queryset.annotate(filtered_room_count=Count('rooms')).exclude(filtered_room_count=0)

        return super().filter_queryset(queryset)

