from django_filters import rest_framework as filters
from campuses.models import Campus

class CampusFilter(filters.FilterSet):
    has_listings = filters.BooleanFilter(method='filter_has_listings')

    class Meta:
        model = Campus
        fields = []

    def filter_has_listings(self, queryset, name, value):
        return queryset.filter(campus_listings__isnull=not value).distinct()
