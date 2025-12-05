from django.utils import timezone
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import UserSession
from users.models import User, Landlord
from listings.models import Room
from billing.models import Subscription

class DashboardKPIView(APIView):
    """
    Returns: DAU, Occupancy Rate, MRR, Pending Verifications.
    """
    permission_classes = [IsSuperAdmin]
    
    @method_decorator(cache_page(60 * 5))
    def get(self, request):
        today = timezone.now().date()
        
        # A. DAU (Daily Active Users)
        dau = UserSession.objects.filter(date=today).count()
        
        # DAU pct_change Calculation (Safe Version)
        yesterday = today - timezone.timedelta(days=1)
        yesterday_dau = UserSession.objects.filter(date=yesterday).count()
        
        if yesterday_dau > 0:
            dau_pct_change = ((dau - yesterday_dau) / yesterday_dau) * 100
        else:
            # If yesterday was 0:
            # If today is > 0, it's a 100% increase (technically infinite, but 100 is safer for UI).
            # If today is 0, it's 0% change.
            dau_pct_change = 100 if dau > 0 else 0
        
        # B. Occupancy Rate
        room_stats = Room.objects.filter(listing__is_active=True).aggregate(
            total_capacity=Sum('max_occupants'),
            total_occupied=Sum('current_occupants')
        )
        # Use 'or 1' to prevent DivisionByZero here too
        total_cap = room_stats['total_capacity'] or 1
        total_occ = room_stats['total_occupied'] or 0
        occupancy_rate = (total_occ / total_cap) * 100

        # C. MRR (Monthly Recurring Revenue)
        mrr_data = Subscription.objects.filter(status='active').aggregate(
            revenue=Sum('tier__price')
        )
        mrr = mrr_data['revenue'] or 0.00

        # D. Pending Verifications
        pending_verifications = Landlord.objects.filter(is_verified=False).count()
        
        # E. Total Users (for context)
        total_users = User.objects.count()

        data = {
            "dau": dau,
            "dau_pct_change": round(dau_pct_change, 1),
            "total_users": total_users,
            "occupancy_rate": round(occupancy_rate, 1),
            "mrr": mrr,
            "pending_verifications": pending_verifications
        }
        
        return Response(data)