from rest_framework.views import APIView
from rest_framework.response import Response

from users.permissions.admin_permissions import IsSuperAdmin
from analytics.models import ListingStat
from analytics.serializers import TopListingSerializer



class TopListingsView(APIView):
    """
    Returns the top n listings by views.
    GET /api/analytics/top-listings/
    """
    permission_classes = [IsSuperAdmin]
    
    def get(self, request):
        num_listings = int(request.query_params.get('n', 10))
        queryset = (
            ListingStat.objects
            .select_related('listing', 'listing__campus')
            .order_by('-total_views')[:num_listings]
        )
        serializer = TopListingSerializer(queryset, many=True)
        return Response(serializer.data)
