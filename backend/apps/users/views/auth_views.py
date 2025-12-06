from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from users.serializers import UserSerializer
# This file defines the authentication views for user login and logout.

User = get_user_model()


class LoginView(ObtainAuthToken):
    """View to handle user login and return user details along with the token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    

class VerifyTokenView(APIView):
    """View to verify the token and return user details."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        admin = request.query_params.get('admin', False)
        
        if admin and not request.user.is_staff:
            return Response({"error": "You are not authorized to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user
        return Response(data=UserSerializer(user).data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        Token.objects.filter(user=user).delete()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
    