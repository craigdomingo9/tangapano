from rest_framework import generics
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from listings.serializers import RetrieveListingSerializer
from listings.models import Listing
from listings.filters import RetrieveRoomFilter
from analytics.models import ListingViewEvent, ListingStat
from django.db.models import F

class ListingRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = RetrieveListingSerializer
    permission_classes = [AllowAny,]
    filterset_class = RetrieveRoomFilter
    throttle_scope = "listing"
    
    filter_backends = [
        DjangoFilterBackend,
    ]

    def retrieve(self, request, *args, **kwargs):
        # 1. Standard Retrieve Logic
        response = super().retrieve(request, *args, **kwargs)
        
        # 2. ACTIVE TRACKING LOGIC
        instance = self.get_object()
        
        # A. Log the raw event
        ListingViewEvent.objects.create(
            listing=instance,
            user=request.user if request.user.is_authenticated else None,
            session_key=request.session.session_key,
            source=request.query_params.get('source', 'direct')
        )
        
        # B. Increment the aggregate counter (Atomic update)
        # We use get_or_create to ensure the Stats object exists
        stat, _ = ListingStat.objects.get_or_create(listing=instance)
        ListingStat.objects.filter(pk=stat.pk).update(total_views=F('total_views') + 1)
        
        return response
    
    def get_serializer_context(self):
        return {'request': self.request}
    