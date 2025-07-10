from rest_framework import generics
from campuses.serializers import NeighborhoodSerializer
from campuses.models import Neighborhood


class NeighborhoodListCreateView(generics.ListCreateAPIView):
    serializer_class = NeighborhoodSerializer
    queryset = Neighborhood.objects.all()

class NeighborhoodDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NeighborhoodSerializer
    queryset = Neighborhood.objects.all()
