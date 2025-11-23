from rest_framework import viewsets, permissions
from listings.serializers import ListingImageSerializer, ListingImageCreateSerializer
from django_filters.rest_framework import DjangoFilterBackend
from listings.models import ListingImage
from listings.filters import ListingImageFIlter
from listings.permissions import IsLandlordsImage

class ListingImageViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing ListingImage instances.
    """
    queryset = ListingImage.objects.all()
    filterset_class = ListingImageFIlter
    filter_backends = [
        DjangoFilterBackend, 
    ]
    
    def get_serializer_class(self):
        if self.action in ["create", "partial_update", "update"]:
            return ListingImageCreateSerializer
        return ListingImageSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsLandlordsImage]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
