from rest_framework import serializers
from listings.models import Category
from .amenity_serializer import AmenitySerializer

class AmenityCategorySerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'display_name', 'amenities']
