from rest_framework import serializers
from campuses.models import City
from .campus_serializer import CampusSerializer

class CitySerializer(serializers.ModelSerializer):
    campuses = CampusSerializer(many=True, read_only=True)
    
    class Meta:
        model = City
        fields = ['id', 'name', 'campuses']
