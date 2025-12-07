from listings.models import Listing
from django_filters import rest_framework as filters


class ListingAdminFilter(filters.FilterSet):
    class Meta:
        model = Listing
        fields = ['landlord']

