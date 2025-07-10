from rest_framework import generics
from campuses.models import Campus
from campuses.serializers import CampusSerializer


class CampusListCreateView(generics.ListCreateAPIView):
    queryset = Campus.objects.all()
    serializer_class = CampusSerializer


class CampusDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Campus.objects.all()
    serializer_class = CampusSerializer
