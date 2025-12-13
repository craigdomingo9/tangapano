from django.conf import settings
from rest_framework import viewsets
from campuses.models import Campus
from campuses.serializers import CampusSerializer, CampusCreateSerializer
from rest_framework import permissions
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
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
    
    def get_serializer_class(self):
        if self.action not in ["list", "retrieve"]:
            return CampusCreateSerializer
        return CampusSerializer
    
    def get_queryset(self):
        return Campus.objects.select_related('agent', 'city').prefetch_related(
            'neighborhoods', 'campus_listings'
        ).all()

    @method_decorator(cache_page(settings.CACHE_TTL, key_prefix='campus_list'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)