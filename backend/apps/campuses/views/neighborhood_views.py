from rest_framework import viewsets
from campuses.serializers import NeighborhoodSerializer
from campuses.models import Neighborhood
from rest_framework import permissions

class NeighborhoodViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing neighborhood instances.
    """
    queryset = Neighborhood.objects.all()
    serializer_class = NeighborhoodSerializer
    permission_classes = [permissions.AllowAny]
