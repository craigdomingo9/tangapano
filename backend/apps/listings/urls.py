from django.urls import path, include
from rest_framework.routers import DefaultRouter

from listings.views import AmenityViewSet, ListingAmenityViewSet, ListingImageViewSet, ListingViewSet, RoomViewSet

router = DefaultRouter()
router.register(r'amenities', AmenityViewSet)
router.register(r'listing-amenities', ListingAmenityViewSet)
router.register(r'listing-images', ListingImageViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'rooms', RoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
