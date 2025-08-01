from rest_framework import viewsets
from campuses.models import Campus
from campuses.serializers import CampusSerializer
from rest_framework import permissions
from campuses.filters import CampusFilter
from django_filters.rest_framework import DjangoFilterBackend


class CampusViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing campus instances.
    """
    queryset = Campus.objects.all()
    serializer_class = CampusSerializer
    
    filter_backends = [
        DjangoFilterBackend, 
    ]
    filterset_class = CampusFilter
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
