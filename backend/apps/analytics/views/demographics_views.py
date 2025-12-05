from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from analytics.models import ListingViewEvent
from analytics.models import UserSession
from users.permissions import IsSuperAdmin

class DemographicsView(APIView):
    """
    Returns: 
    - Top Campuses (based on what listings are being viewed)
    - Device Breakdown (Mobile vs Desktop)
    """
    permission_classes = [IsSuperAdmin]
    
    @method_decorator(cache_page(60 * 60))
    def get(self, request):
        # A. Top Campuses by Interest (Views)
        campus_stats = ListingViewEvent.objects.values('listing__campus__name')\
            .annotate(count=Count('id'))\
            .order_by('-count')[:5]
            
        # B. Device Breakdown (Simple Parsing of UserSession)
        # Scan last 7 days for speed
        sessions = UserSession.objects.filter(date__gte=timezone.now() - timezone.timedelta(days=7))
        mobile = 0
        desktop = 0
        
        for s in sessions:
            if not s.user_agent: continue
            ua = s.user_agent.lower()
            if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
                mobile += 1
            else:
                desktop += 1
                
        return Response({
            "campuses": [
                {"name": c['listing__campus__name'], "value": c['count']} # Renamed 'count' to 'value'
                for c in campus_stats
            ],
            "devices": [
                { "name": "Mobile", "value": mobile, "fill": "#3b82f6" },  # Added color for UI
                { "name": "Desktop", "value": desktop, "fill": "#1e293b" }
            ]
        })