from rest_framework import viewsets
from listings.serializers import ListingAmenitySerializer
from listings.models import ListingAmenity

class ListingAmenityViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing ListingAmenity instances.
    """
    queryset = ListingAmenity.objects.all()
    serializer_class = ListingAmenitySerializer

