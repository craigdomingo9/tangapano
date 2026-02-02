from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, F
from django.contrib.auth import get_user_model
from users.models import Landlord, Agent
from users.serializers import LandlordSerializer, AgentSerializer, AgentWriteSerializer, ChangePasswordSerializer
from users.permissions.admin_permissions import IsSuperAdmin
from notifications.models import Notification


from notifications.utils.action_utils import log_and_notify_notable_action

User = get_user_model()


class AdminLandlordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin-only viewset to list and manage landlords.
    """
    queryset = Landlord.objects.all()
    serializer_class = LandlordSerializer
    permission_classes = [IsSuperAdmin]

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """
        POST /api/admin/landlords/{id}/verify/
        Sets is_verified=True and alerts the user.
        """
        landlord = self.get_object()
        
        if landlord.is_verified:
            return Response({'status': 'already verified'}, status=status.HTTP_200_OK)

        # 1. Update State
        landlord.is_verified = True
        landlord.save()

        # 2. Log and Notify (Executive/Admin)
        log_and_notify_notable_action(
            action_type='landlord_verified',
            description=f"Admin {request.user.username} verified landlord {landlord.user.username}",
            actor=request.user,
            metadata={'landlord_id': landlord.id, 'username': landlord.user.username}
        )

        # 3. Send Notification (To Landlord)
        Notification.objects.create(
            recipient=landlord.user,
            title="Account Verified!",
            message="Your landlord profile has been verified. You now have the verified badge.",
            notification_type="success",
            category="system"
        )

        return Response({'status': 'verified'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        landlord = self.get_object()

        landlord.is_verified = False
        landlord.save()

        # Log and Notify (Executive/Admin)
        log_and_notify_notable_action(
            action_type='landlord_unverified',
            description=f"Admin {request.user.username} suspended/unverified landlord {landlord.user.username}",
            actor=request.user,
            metadata={'landlord_id': landlord.id, 'username': landlord.user.username}
        )

        Notification.objects.create(
            recipient=landlord.user,
            title="Account Suspension",
            message=f"Your account has been suspended. Contact support if you believe this to have been unjustified.",
            notification_type="error",
            category="system"
        )

        return Response({'status': 'suspended'}, status=status.HTTP_200_OK)


class AdminAgentViewSet(viewsets.ModelViewSet):
    """
    Admin-only viewset to list and manage agents.
    """
    queryset = Agent.objects\
        .annotate(
            total_listings=Count('campus__campus_listings'),
            campus_name=F('campus__name'),
            campus_id=F('campus__id'),
        )
    serializer_class = AgentSerializer
    permission_classes = [IsSuperAdmin]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AgentWriteSerializer
        return AgentSerializer
    
    def perform_create(self, serializer):
        """
        This method triggers the serializer's complex create logic.
        """
        # The serializer's .create() method will now handle:
        # 1. Creating the User.
        # 2. Creating the Agent.
        # 3. Setting the reverse Campus relationship.
        serializer.save()


class AdminChangePasswordView(generics.CreateAPIView):
    """
    Admin/Staff-only endpoint to change a user's password by username.
    
    POST /api/users/admin/change-password/
    Request body:
    {
        "username": "john_doe",
        "new_password": "new_secure_password_123"
    }
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsSuperAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        new_password = serializer.validated_data['new_password']

        # Get the user and update their password
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()

        # Log the action
        log_and_notify_notable_action(
            action_type='user_password_changed',
            description=f"Admin {request.user.username} changed password for user {username}",
            actor=request.user,
            metadata={'target_username': username, 'target_user_id': user.id}
        )

        return Response(
            {
                'status': 'password changed successfully',
                'username': username
            },
            status=status.HTTP_200_OK
        )
        