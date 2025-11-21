# Standard Library
from rest_framework import generics
from rest_framework import permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from django.db.models import Prefetch

# Local
from listings.serializers import ListingSerializer
from listings.models import Listing
from listings.pagination import StandardResultsSetPagination
from listings.filters import ListingFilter
from listings.filters import AliasedOrderingFilter
from listings.models import Room, ListingImage




class ListingAPIView(generics.ListAPIView):
    """
    A viewset for viewing
    Supports filtering, pagination, and ordering by room price, distance, etc.
    """
    
    queryset = Listing.objects.all().distinct()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filterset_class = ListingFilter
    throttle_scope = "listings"
    
    filter_backends = [
        DjangoFilterBackend, 
        AliasedOrderingFilter
    ]

    ordering_fields = ['price', 'distance']
    
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def get_queryset(self):
        return Listing.objects.select_related(
            'landlord', 'campus', 'neighborhood'
        ).prefetch_related(
            Prefetch('images', queryset=ListingImage.objects.select_related('listing'))
        ).all()
    
    
    @method_decorator(cache_page(settings.CACHE_TTL, key_prefix='listings_list'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
