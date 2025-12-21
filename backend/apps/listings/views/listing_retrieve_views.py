from rest_framework import generics
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
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
        instance = self.get_object()
        
        print(request.user)
        # 1. EXCLUDE SELF-VIEWS AND STAFF
        if request.user.is_authenticated and (instance.landlord.user == request.user or request.user.is_staff):
            return super().retrieve(request, *args, **kwargs)

        # 2. DEBOUNCE (Check if viewed in last 30 mins)
        session_key = request.session.session_key
        cutoff = timezone.now() - timedelta(minutes=30)
        
        already_viewed = ListingViewEvent.objects.filter(
            listing=instance,
            session_key=session_key,
            timestamp__gte=cutoff
        ).exists()

        if not already_viewed:
            # Create Log
            ListingViewEvent.objects.create(
                listing=instance,
                user=request.user if request.user.is_authenticated else None,
                session_key=session_key
            )
            # Increment Counter (Atomic)
            stat, _ = ListingStat.objects.get_or_create(listing=instance)
            ListingStat.objects.filter(pk=stat.pk).update(total_views=F('total_views') + 1)
        
        return super().retrieve(request, *args, **kwargs)
    
    def get_serializer_context(self):
        return {'request': self.request}
    