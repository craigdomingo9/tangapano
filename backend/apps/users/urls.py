from django.urls import path
from .views import UserRegistrationView, UserProfileView, UserListView, LoginView, LogoutView

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("me/", UserProfileView.as_view(), name="user-profile"),
    path("all/", UserListView.as_view(), name="user-list"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    path("login/", LoginView.as_view(), name="user-login"),
]
# This file defines the URL patterns for the user-related views in the application.
# It maps specific URL paths to their corresponding view classes, allowing for user registration,
# login, logout, and profile management.