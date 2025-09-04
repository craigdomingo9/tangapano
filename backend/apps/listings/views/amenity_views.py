from rest_framework import viewsets, permissions
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from listings.serializers import AmenitySerializer
from listings.models import Amenity


class AmenityViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Amenity instances.
    """
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    @method_decorator(cache_page(settings.CACHE_TTL, key_prefix='amenity_list'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
