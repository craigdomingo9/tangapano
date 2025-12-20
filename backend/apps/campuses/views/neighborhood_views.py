from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from campuses.serializers import NeighborhoodSerializer
from campuses.models import Neighborhood
from rest_framework import permissions
from campuses.filters import NeighborhoodFilter
from users.permissions import IsSuperAdmin
from notifications.utils.action_utils import log_and_notify_notable_action

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

    def perform_create(self, serializer):
        neighborhood = serializer.save()
        log_and_notify_notable_action(
            action_type='neighborhood_created',
            description=f"Admin {self.request.user.username} created neighborhood '{neighborhood.name}'",
            actor=self.request.user,
            metadata={'neighborhood_id': neighborhood.id, 'name': neighborhood.name}
        )

    def perform_update(self, serializer):
        neighborhood = serializer.save()
        log_and_notify_notable_action(
            action_type='neighborhood_updated',
            description=f"Admin {self.request.user.username} updated neighborhood '{neighborhood.name}'",
            actor=self.request.user,
            metadata={'neighborhood_id': neighborhood.id, 'name': neighborhood.name}
        )

