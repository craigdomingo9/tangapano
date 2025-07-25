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
    permission_classes = [permissions.AllowAny]
    
    filter_backends = [
        DjangoFilterBackend, 
    ]
    filterset_class = CampusFilter
