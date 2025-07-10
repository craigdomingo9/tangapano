from rest_framework import viewsets
from listings.serializers import ListingSerializer
from listings.models import Listing


class ListingViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Listing instances.
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def perform_create(self, serializer):
        # Custom logic before saving a new listing can be added here
        serializer.save()

    def perform_update(self, serializer):
        # Custom logic before updating a listing can be added here
        serializer.save()
        
        