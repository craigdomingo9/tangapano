from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
# Ensure this imports the serializer from the PREVIOUS step
from users.serializers import UserRegistrationSerializer 
from users.serializers import UserSerializer

User = get_user_model()

# 🔐 1. Register new user
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

# 👤 2. Get/Update current logged-in user
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# 👥 3. List all users (Admin only)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserSerializer