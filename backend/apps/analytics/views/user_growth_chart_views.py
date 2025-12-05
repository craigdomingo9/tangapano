from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDay
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.serializers import GrowthChartSerializer
from users.models import User

class UserGrowthChartView(APIView):
    """
    Returns data for the User Acquisition Line Chart.
    GET /api/analytics/growth/
    """
    permission_classes = [IsSuperAdmin]
    
    @method_decorator(cache_page(60 * 60))
    def get(self, request):
        # Get last 30 days
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        
        # Group by Day, Count IDs
        growth_data = User.objects.filter(
            date_joined__gte=thirty_days_ago
        ).annotate(
            date=TruncDay('date_joined')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')

        # Format for Frontend
        results = [
            {"date": item['date'].date(), "count": item['count']} 
            for item in growth_data
        ]
        
        serializer = GrowthChartSerializer(results, many=True)
        return Response(serializer.data)
