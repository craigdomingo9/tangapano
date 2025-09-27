from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from django.conf import settings
from listings.serializers import ListingSerializer
from listings.models import Listing
from listings.filters import RetrieveRoomFilter


class ListingRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [AllowAny,]
    filterset_class = RetrieveRoomFilter
    throttle_scope = "listing"
    
    filter_backends = [
        DjangoFilterBackend,
    ]

    @method_decorator(cache_page(settings.CACHE_TTL, key_prefix='listings_list'))
    def get(self, request, *args, **kwargs):
        
        return super().get(request, *args, **kwargs)
    
    def get_cache_key(self):
        listing_id = self.kwargs.get('pk')
        return f'listing_{listing_id}_v1'
    
    def retrieve(self, request, *args, **kwargs):
        # Object-level caching with serialized data
        cache_key = self.get_cache_key()
        cached_data = cache.get(cache_key)
        
        if cached_data is not None:
            return self.respond_from_cache(cached_data)
        
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Cache the serialized data
        cache.set(cache_key, data, settings.CACHE_TTL)
        
        return self.respond_from_cache(data)
    
    def respond_from_cache(self, data):
        from rest_framework.response import Response
        return Response(data)

    
