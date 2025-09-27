from listings.models import Room, Listing
from django_filters import rest_framework as filters
from django.db.models import Q, Prefetch, F


class RoomFilter(filters.FilterSet):
    class Meta:
        model = Listing
        fields = []
    
    def filter_queryset(self, queryset):
        """
        Filter the queryset based on the given query parameters.

        If the 'is_full' parameter is present, filter the queryset to only
        include rooms that are not full.

        Prefetch the 'rooms' relation to improve performance.
        """

        params = self.request.query_params
        has_filters = any([
            params.get('is_full'),
        ])
        
        if has_filters:
            filter_query = Q()
            if params.get('is_full'):
                filter_query &= Q(current_occupants__lt=F('max_occupants'))
            
            queryset = queryset.prefetch_related(
                Prefetch('rooms', 
                    queryset=Room.objects.filter(filter_query).order_by('rent_per_month')
                )
            )
        
        return super().filter_queryset(queryset)
            
            
            
            