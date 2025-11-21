# listings/views.py

from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    OrderingFilterBackend,
    DefaultOrderingFilterBackend,
)
from .documents import ListingDocument
from .serializers import ListingDocumentSerializer
from .filters import RoomCompositeFilterBackend, AmenityDynamicMatchBackend

class ListingSearchViewSet(DocumentViewSet):
    document = ListingDocument
    serializer_class = ListingDocumentSerializer
    lookup_field = 'id'
    
    # The order of backends is important!
    filter_backends = [
        FilteringFilterBackend,       # For standard exact matches
        OrderingFilterBackend,        # For sorting
        DefaultOrderingFilterBackend,
        RoomCompositeFilterBackend,   # Our custom complex nested logic
        AmenityDynamicMatchBackend,   # Our custom amenity logic
    ]

    # Define standard fields for FilteringFilterBackend
    filter_fields = {
        'campus': 'campus',
        'neighborhood': 'neighborhood',
    }

    # Define sorting
    ordering_fields = {
        'id': 'id',
    }
    ordering = ('id',)
    