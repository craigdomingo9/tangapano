from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from django.db.models import Count, Sum
from listings.models import Listing
from campuses.models import Campus

class RegionalInterestView(APIView):
    """
    Returns regional interest data formatted for the Heatmap component.
    Structure: [{ "region": "Downtown", "value": 85 }, ...]
    """
    @method_decorator(cache_page(60 * 15)) 
    def get(self, request):
        top = 5
        
        # Get the top n campuses by interest
        campuses_query = Campus.objects.annotate(
            total_interest=Sum('campus_listings__stats__total_inquiries')
        )

        campuses = campuses_query.order_by('-total_interest')[:top]

        # Populate the payload
        payload = []
        for campus in campuses:
            payload.append({"region": campus.name, "value": campus.total_interest})

        return Response(payload, status=status.HTTP_200_OK)