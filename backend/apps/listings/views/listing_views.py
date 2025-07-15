from rest_framework import viewsets
from listings.serializers import ListingSerializer
from listings.models import Listing
from rest_framework import permissions
from listings.pagination import StandardResultsSetPagination
from listings.filters import ListingFilter
from django_filters.rest_framework import DjangoFilterBackend

class ListingViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Listing instances.
    Supports filtering, pagination, and ordering by room price, distance, etc.
    """
    queryset = Listing.objects.all().distinct()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend,]
    filterset_class = ListingFilter

