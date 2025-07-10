from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
# This file defines the authentication views for user login and logout.

User = get_user_model()


class LoginView(ObtainAuthToken):
    """View to handle user login and return user details along with the token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
        

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        Token.objects.filter(user=user).delete()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
    