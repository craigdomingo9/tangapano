from django.utils import timezone
from django.db.models import Sum, F, FloatField
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import UserSession
from users.models import User, Landlord
from listings.models import Room
from billing.models import Subscription
from interests.models import Interest  # <--- NEW IMPORT

class DashboardKPIView(APIView):
    """
    Returns: DAU, Daily Interests, Occupancy Rate, MRR, Pending Verifications.
    """
    permission_classes = [IsSuperAdmin]
    
    @method_decorator(cache_page(60 * 15))
    def get(self, request):
        today = timezone.now().date()
        yesterday = today - timezone.timedelta(days=1)
        
        # --- A. DAU (Daily Active Users) ---
        dau = UserSession.objects.filter(date=today).count()
        yesterday_dau = UserSession.objects.filter(date=yesterday).count()
        
        if yesterday_dau > 0:
            dau_pct_change = ((dau - yesterday_dau) / yesterday_dau) * 100
        else:
            dau_pct_change = 100 if dau > 0 else 0
            
        # --- F. NEW: Daily Interests (Inquiries) ---
        # We assume 'timestamp' is the created_at field on the Interest model
        daily_interests = Interest.objects.filter(timestamp__date=today).count()
        yesterday_interests = Interest.objects.filter(timestamp__date=yesterday).count()
        
        if yesterday_interests > 0:
            interest_pct_change = ((daily_interests - yesterday_interests) / yesterday_interests) * 100
        else:
            interest_pct_change = 100 if daily_interests > 0 else 0
        
        # --- B. Occupancy & Capacity ---
        room_stats = Room.objects.filter(listing__is_active=True).aggregate(
            total_capacity=Sum('max_occupants'),
            total_occupied=Sum('current_occupants')
        )
        
        total_cap = room_stats['total_capacity'] or 1
        total_occ = room_stats['total_occupied'] or 0
        occupancy_rate = (total_occ / total_cap) * 100
        remaining_beds = total_cap - total_occ

        # --- C. Remaining Units Value (RUV) ---
        ruv_query = Room.objects.filter(
            listing__is_active=True,
            listing__apply_agent_fee=True, 
            listing__campus__agent__isnull=False
        ).aggregate(
            potential_value=Sum(
                (F('max_occupants') - F('current_occupants')) * F('listing__campus__agent__agent_fee'),
                output_field=FloatField()
            )
        )
        remaining_rooms_value = ruv_query['potential_value'] or 0.00

        # --- D. Pending Verifications ---
        pending_verifications = Landlord.objects.filter(is_verified=False).count()
        
        # --- E. Total Users ---
        total_users = User.objects.count()

        data = {
            # Traffic
            "dau": dau,
            "dau_pct_change": round(dau_pct_change, 1),
            
            # Leads (New Section)
            "daily_interests": daily_interests,
            "interest_pct_change": round(interest_pct_change, 1),
            
            # Inventory
            "total_users": total_users,
            "total_occupied": total_occ,
            "total_capacity": total_cap,
            "occupancy_rate": round(occupancy_rate, 1),
            "remaining_rooms": remaining_beds,
            "remaining_rooms_value": round(remaining_rooms_value, 2),
            
            # Admin Tasks
            "pending_verifications": pending_verifications,
        }
        
        return Response(data)