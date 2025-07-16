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
    
    queryset = Listing.objects.all().distinct()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filterset_class = ListingFilter
    
    filter_backends = [
        DjangoFilterBackend, 
        AliasedOrderingFilter
    ]

    ordering_fields = ['price', 'distance']
    
    
    # @method_decorator(cache_page(settings.CACHE_TTL))
    # @method_decorator(vary_on_headers('Cookie'))
    # @method_decorator(vary_on_cookie)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

