# Standard Library
from rest_framework import viewsets
from rest_framework import permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings

# Local
from listings.serializers import ListingSerializer
from listings.models import Listing
from listings.pagination import StandardResultsSetPagination
from listings.filters import ListingFilter
from listings.filters import AliasedOrderingFilter


class ListingViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Listing instances.
    Supports filtering, pagination, and ordering by room price, distance, etc.
    """
    
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filterset_class = ListingFilter
    
    filter_backends = [
        DjangoFilterBackend, 
        AliasedOrderingFilter
    ]

    ordering_fields = ['price', 'distance']
    ordering = ['price']  # default sort
    
    def get_cache_decorators(self):
        """Return cache decorators only in production."""
        if not settings.DEBUG:
            return [
                vary_on_headers('Cookie'),
                cache_page(60 * 60 * 2),  # 2 hours
                vary_on_cookie,
            ]
        return []

    def dispatch(self, *args, **kwargs):
        for decorator in self.get_cache_decorators():
            self.list = method_decorator(decorator)(self.list)
        return super().dispatch(*args, **kwargs)

