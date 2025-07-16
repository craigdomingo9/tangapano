from rest_framework import serializers
from listings.models import ListingAmenity
from listings.serializers import AmenitySerializer

class ListingAmenitySerializer(serializers.ModelSerializer):
    amenity = AmenitySerializer(read_only=True)
    
    class Meta:
        model = ListingAmenity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        
