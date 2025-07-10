from django.urls import path
from campuses.views import CampusDetailView, CampusListCreateView, NeighborhoodDetailView, NeighborhoodListCreateView

urlpatterns = [
    path('campuses/', CampusListCreateView.as_view()),
    path('campuses/<pk>/', CampusDetailView.as_view()),
    path('neighborhoods/', NeighborhoodListCreateView.as_view()),
    path('neighborhoods/<pk>/', NeighborhoodDetailView.as_view()),
]

# This file defines the URL patterns for the campuses app, mapping URLs to views.