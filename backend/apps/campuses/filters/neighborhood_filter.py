from django_filters import rest_framework as filters
from campuses.models import Neighborhood

class NeighborhoodFilter(filters.FilterSet):
    has_listings = filters.BooleanFilter(method='filter_has_listings')
    
    class Meta:
        model = Neighborhood
        fields = []
    
    def filter_has_listings(self, queryset, name, value):
        return queryset.filter(neighborhood_listings__isnull=not value).distinct()


