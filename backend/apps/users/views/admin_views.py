from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, F
from users.models import Landlord, Agent
from users.serializers import LandlordSerializer, AgentSerializer, AgentWriteSerializer
from users.permissions.admin_permissions import IsSuperAdmin
from notifications.models import Notification


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

        # 2. Send Notification
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
        