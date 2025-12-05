from rest_framework import viewsets, permissions
from billing.models import Subscription
from billing.serializers import SubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    Manage subscriptions. 
    Landlords can see their own. Admins can manage all.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Subscription.objects.all()
        # Ensure user is a landlord
        if hasattr(user, 'landlord_profile'):
            return Subscription.objects.filter(landlord=user.landlord_profile)
        return Subscription.objects.none()