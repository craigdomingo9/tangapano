from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from users.permissions import IsSuperAdmin
from notifications.utils.action_utils import log_and_notify_notable_action

User = get_user_model()


class AdminLoginView(ObtainAuthToken):
    """View to handle user login and return user details along with the token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None and (user.is_superuser or user.is_staff):
            token, _ = Token.objects.get_or_create(user=user)
            
            # Log and Notify
            log_and_notify_notable_action(
                action_type='admin_login',
                description=f"Admin login: {user.username}",
                actor=user,
                metadata={'ip_address': request.META.get('REMOTE_ADDR')}
            )
            
            return Response({"token": token.key})
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



class AdminPriviledgedAuthView(APIView):
    """View to allow admin to login into a user's account based on their id only"""
    permission_classes = [IsSuperAdmin]

    def post(self, request, *args, **kwargs):
        admin_user = request.user

        if not admin_user.is_superuser and not admin_user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = request.data.get('user_id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Invalid user id. User does not exist",}, status=status.HTTP_404_NOT_FOUND)
        
        if admin_user.is_superuser or admin_user.is_staff:
            token, _ = Token.objects.get_or_create(user=user)
            
            # Log and Notify
            log_and_notify_notable_action(
                action_type='admin_temp_auth',
                description=f"Admin {admin_user.username} used privileged auth to login as {user.username}",
                actor=admin_user,
                metadata={'target_user_id': user.id, 'target_username': user.username}
            )
            
            return Response({"token": token.key})
        else:
            return Response({"error": "Invalid user id", }, status=status.HTTP_401_UNAUTHORIZED)


