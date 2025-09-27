from django.urls import path, include
from rest_framework.routers import DefaultRouter

from listings.views import (
    AmenityViewSet, 
    ListingImageViewSet, 
    ListingAPIView, 
    ListingRetrieveAPIView, 
    RoomViewSet, 
    LandlordListingViewSet
)

router = DefaultRouter()
router.register(r'amenities', AmenityViewSet, basename='amenities')
router.register(r'listing-images', ListingImageViewSet, basename='listing-images')
router.register(r'landlord-listings', LandlordListingViewSet, basename='landlord-listings')
router.register(r'rooms', RoomViewSet, basename='rooms')

urlpatterns = [
    path('listings/', ListingAPIView.as_view(), name='listings'),
    path('listing/<int:pk>/', ListingRetrieveAPIView.as_view(), name='listing')
] + router.urls
