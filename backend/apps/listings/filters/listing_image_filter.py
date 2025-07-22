from django_filters import rest_framework as filters
from listings.models import ListingImage


class ListingImageFIlter(filters.FilterSet):
    
    class Meta:
        model = ListingImage
        fields = ['listing']



