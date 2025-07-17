from rest_framework import viewsets, permissions
from listings.serializers import AmenitySerializer
from listings.models import Amenity


class AmenityViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Amenity instances.
    """
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
