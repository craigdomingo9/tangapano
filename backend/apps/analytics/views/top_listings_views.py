from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import ListingStat
from analytics.serializers import TopListingSerializer



class TopListingsView(APIView):
    """
    Returns the top n listings by views.
    GET /api/analytics/top-listings/
    """
    permission_classes = [IsSuperAdmin]
    
    @method_decorator(cache_page(60 * 15))
    def get(self, request):
        if request.query_params.get('num_listings'):
            num_listings = int(request.query_params.get('num_listings'))
        else:
            num_listings = 10
            
        campus_id = request.query_params.get('campus')
        
        # Base Query
        queryset = ListingStat.objects.select_related('listing__campus')
        
        # Filter
        if campus_id:
            queryset = queryset.filter(listing__campus_id=campus_id)
            
        queryset = queryset.order_by('-total_inquiries')[:num_listings]
        
        data = []
        for stat in queryset:
            # Calculate Conversion Rate
            conv_rate = 0
            if stat.total_views > 0:
                conv_rate = (stat.total_inquiries / stat.total_views) * 100
            
            data.append({
                "id": stat.listing.id,
                "title": stat.listing.title,
                "location": stat.listing.campus.name,
                "views": stat.total_views,
                "inquiries": stat.total_inquiries,
                "conv_rate": round(conv_rate, 1)
            })
        
        return Response(data)
