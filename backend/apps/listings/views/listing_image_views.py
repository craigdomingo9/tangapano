from rest_framework import viewsets
from listings.serializers import ListingImageSerializer
from listings.models import ListingImage

class ListingImageViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing ListingImage instances.
    """
    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
