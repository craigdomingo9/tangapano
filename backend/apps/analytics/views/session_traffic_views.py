from django.db.models import Count, Case, When, IntegerField, Q
from django.db.models.functions import TruncDay
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import UserSession

class SessionTrafficView(APIView):
    """
    Returns stacked bar chart data: Date | Anonymous | LoggedIn
    """
    permission_classes = [IsSuperAdmin]
    
    @method_decorator(cache_page(60 * 15))
    def get(self, request):
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        
        stats = UserSession.objects.filter(date__gte=thirty_days_ago)\
            .annotate(day=TruncDay('date'))\
            .values('day')\
            .annotate(
                total=Count('id'),
                logged_in=Count(Case(When(user__isnull=False, then=1), output_field=IntegerField())),
                anonymous=Count(Case(When(user__isnull=True, then=1), output_field=IntegerField()))
            ).order_by('day')
            
        return Response([
            {
                "date": item['day'].strftime('%Y-%m-%d'),
                "logged_in": item['logged_in'],
                "anonymous": item['anonymous']
            } for item in stats
        ])