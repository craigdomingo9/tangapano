from django.urls import path, include
from rest_framework.routers import DefaultRouter

from listings.views import AmenityViewSet, ListingAmenityViewSet, ListingImageViewSet, ListingAPIView, RoomViewSet, LandlordListingViewSet

router = DefaultRouter()
router.register(r'amenities', AmenityViewSet, basename='amenities')
router.register(r'listing-amenities', ListingAmenityViewSet, basename='listing-amenities')
router.register(r'listing-images', ListingImageViewSet, basename='listing-images')
router.register(r'landlord-listings', LandlordListingViewSet, basename='landlord-listings')
router.register(r'rooms', RoomViewSet, basename='rooms')

urlpatterns = [
    path('', include(router.urls)),
    path('listings/', ListingAPIView.as_view(), name='listings')
]
