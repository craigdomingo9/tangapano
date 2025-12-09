from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from campuses.serializers import NeighborhoodSerializer
from campuses.models import Neighborhood
from rest_framework import permissions
from campuses.filters import NeighborhoodFilter
from users.permissions import IsSuperAdmin

class NeighborhoodViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing neighborhood instances.
    """
    queryset = Neighborhood.objects.all()
    serializer_class = NeighborhoodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    filter_backends = [
        DjangoFilterBackend, 
    ]
    filterset_class = NeighborhoodFilter
    
    def get_permissions(self):
        if self.action in ["create", "update", "destroy", "partial_update"]:
            self.permission_classes = [IsSuperAdmin]
        else:
            self.permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return super().get_permissions()
