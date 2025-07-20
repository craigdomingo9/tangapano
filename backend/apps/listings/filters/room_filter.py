from listings.models import Room
from django_filters import rest_framework as filters


class RoomFilter(filters.FilterSet):
    class Meta:
        model = Room
        fields = ['listing']

