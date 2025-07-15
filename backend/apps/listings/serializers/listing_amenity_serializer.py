from rest_framework import serializers
from listings.models import ListingAmenity


class ListingAmenitySerializer(serializers.ModelSerializer):
    amenity = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ListingAmenity
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        
