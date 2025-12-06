from rest_framework import viewsets, permissions
from interests.models import Interest
from interests.serializers import InterestSerializer
from analytics.models import ListingStat
from notifications.models import Notification
from django.db.models import F

class InterestsViewSet(viewsets.ModelViewSet):
    """
    Handles student inquiries. 
    Open to public (AllowAny) so students can inquire without signing up.
    """
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "inquiries" # Good practice to rate-limit this
    
    def perform_create(self, serializer):
        interest = serializer.save()
        
        room = interest.room

        recipient_user = None
        if interest.contacted_agent:
            recipient_user = interest.contacted_agent.user
        elif room.listing.landlord:
            recipient_user = room.listing.landlord.user
            
        if recipient_user:
            Notification.objects.create(
                recipient=recipient_user,
                title="New Student Inquiry",
                message=f"You have a new inquiry for {room.listing.title} from {interest.full_name}.",
                category="inquiry",
                action_link=f"/dashboard/inquiries/{interest.id}"
            )
