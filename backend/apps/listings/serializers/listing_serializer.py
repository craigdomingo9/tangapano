from rest_framework import serializers
from listings.models import Listing

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'landlord', 'title', 'description', 'images', 'amenities', 'rent_per_month', 'campus', 'neighborhood', 'distance_from_campus', 'is_active', 'rooms', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')
        depth = 1

