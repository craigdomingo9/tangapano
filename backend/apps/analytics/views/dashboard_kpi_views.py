from django.utils import timezone
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import UserSession
from analytics.serializers import KPISerializer
from users.models import User, Landlord
from listings.models import Room
from billing.models import Subscription

class DashboardKPIView(APIView):
    """
    Returns the top-level metric cards for the Admin Dashboard.
    GET /api/analytics/kpi/
    """
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        today = timezone.now().date()
        
        # 1. DAU (Daily Active Users)
        dau = UserSession.objects.filter(date=today).count()
        
        # 2. Total Users
        total_users = User.objects.count()

        # 3. Occupancy Rate (Sum of current vs max occupants across ALL rooms)
        room_stats = Room.objects.aggregate(
            total_capacity=Sum('max_occupants'),
            total_occupied=Sum('current_occupants')
        )
        total_cap = room_stats['total_capacity'] or 1 # Avoid division by zero
        total_occ = room_stats['total_occupied'] or 0
        occupancy_rate = (total_occ / total_cap) * 100

        # 4. MRR (Monthly Recurring Revenue)
        # Sum of prices of all ACTIVE subscriptions
        mrr_data = Subscription.objects.filter(status='active').aggregate(
            revenue=Sum('tier__price')
        )
        mrr = mrr_data['revenue'] or 0.00

        # 5. Pending Verifications (Action Item)
        pending_verifications = Landlord.objects.filter(
            is_verified=False
            # You might add logic here: .exclude(doc_file='')
        ).count()

        data = {
            "dau": dau,
            "total_users": total_users,
            "occupancy_rate": round(occupancy_rate, 1),
            "mrr": mrr,
            "pending_verifications": pending_verifications
        }
        
        serializer = KPISerializer(data)
        return Response(serializer.data)