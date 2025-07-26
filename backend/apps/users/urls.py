from django.urls import path
from .views import UserRegistrationView, UserProfileView, UserListView, LoginView, LogoutView, VerifyTokenView, LandlordRetrieveUpdateView


urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("me/", UserProfileView.as_view(), name="user-profile"),
    path("all/", UserListView.as_view(), name="user-list"),
    path("auth/logout/", LogoutView.as_view(), name="user-logout"),
    path("auth/login/", LoginView.as_view(), name="user-login"),
    path("auth/verify-token/", VerifyTokenView.as_view(), name="user-verify-token"),
    path("landlords/", LandlordRetrieveUpdateView.as_view(), name="landlord-detail"),
]
# This file defines the URL patterns for the user-related views in the application.
# It maps specific URL paths to their corresponding view classes, allowing for user registration,
# login, logout, and profile management.