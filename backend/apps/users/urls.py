from django.urls import path
from users.views import (
    user_views, 
    auth_views, 
    landlord_views, 
    lookup_user_views
)

urlpatterns = [
    # Auth
    path("register/", user_views.UserRegistrationView.as_view(), name="user-register"),
    path("auth/login/", auth_views.LoginView.as_view(), name="user-login"),
    path("auth/logout/", auth_views.LogoutView.as_view(), name="user-logout"),
    path("auth/verify-token/", auth_views.VerifyTokenView.as_view(), name="user-verify-token"),
    
    # Profiles
    path("me/", user_views.UserProfileView.as_view(), name="user-profile"),
    path("landlords/", landlord_views.LandlordRetrieveUpdateView.as_view(), name="landlord-detail"),
    
    # Utilities / Admin
    path("all/", user_views.UserListView.as_view(), name="user-list"),
    path("lookup/", lookup_user_views.UserLookupView.as_view(), name="user-lookup"),
]
