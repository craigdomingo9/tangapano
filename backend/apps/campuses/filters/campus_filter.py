from django_filters import rest_framework as filters
from campuses.models import Campus

class CampusFilter(filters.FilterSet):
    has_listings = filters.BooleanFilter(method='filter_has_listings')
    # Allow filtering by 'city_name=Harare'
    city_name = filters.CharFilter(field_name='city__name', lookup_expr='icontains')
    # Allow filtering by 'city_id=1'
    city_id = filters.NumberFilter(field_name='city__id')
    
    class Meta:
        model = Campus
        fields = []

    def filter_has_listings(self, queryset, name, value):
        return queryset.filter(campus_listings__isnull=not value).distinct()
