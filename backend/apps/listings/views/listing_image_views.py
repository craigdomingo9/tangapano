from rest_framework import viewsets, permissions
from listings.serializers import ListingImageSerializer, ListingImageCreateSerializer
from django_filters.rest_framework import DjangoFilterBackend
from listings.models import ListingImage
from listings.filters import ListingImageFIlter

class ListingImageViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing ListingImage instances.
    """
    queryset = ListingImage.objects.all()
    permission_classes = [permissions.AllowAny]
    filterset_class = ListingImageFIlter
    filter_backends = [
        DjangoFilterBackend, 
    ]
    
    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return ListingImageCreateSerializer
        return ListingImageSerializer
    
