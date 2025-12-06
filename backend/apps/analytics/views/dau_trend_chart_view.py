from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import UserSession

class DAUTrendChartView(APIView):
    """
    Returns DAU (Daily Active Users) for the last 14 days.
    Format: [{ "date": "YYYY-MM-DD", "count": 120 }, ...]
    Includes "Zero-filling" to ensure the chart has no gaps.
    """
    permission_classes = [IsSuperAdmin]

    # Cache for 1 hour since historical days don't change, 
    # and today updates gradually.
    @method_decorator(cache_page(60 * 15)) 
    def get(self, request):
        today = timezone.now().date()
        start_date = today - timedelta(days=14) # 14 days range
        
        # 1. Database Query: Group by Date and Count
        # This only returns dates that actually have traffic.
        # Format: <QuerySet [{'date': datetime.date(2023, 11, 1), 'count': 5}, ...]>
        db_data = UserSession.objects.filter(
            date__range=[start_date, today]
        ).values('date').annotate(
            count=Count('id')
        )

        # 2. Convert to Dictionary for O(1) Lookup
        # Key: Date Object, Value: Count
        stats_map = {item['date']: item['count'] for item in db_data}

        # 3. Construct the 14-Day Timeline (Filling Zeros)
        results = []
        for i in range(15):
            current_day = start_date + timedelta(days=i)
            
            results.append({
                # Format date as string for JSON
                "date": current_day.strftime("%Y-%m-%d"), 
                "count": stats_map.get(current_day, 0) 
            })

        return Response(results)