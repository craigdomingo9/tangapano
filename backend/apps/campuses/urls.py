from django.urls import path
from campuses.views import CampusViewSet, NeighborhoodViewSet, CityViewSet
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'campuses', CampusViewSet, basename='campus')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'neighborhoods', NeighborhoodViewSet, basename='neighborhood')

urlpatterns = router.urls
# This file defines the URL patterns for the campuses app, mapping URLs to views.