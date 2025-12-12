from rest_framework import serializers
from listings.models import ListingLocation

class ListingMapSerializer(serializers.ModelSerializer):
    # 1. Listing Coordinates (Calculated based on booking status)
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()
    is_approximate = serializers.SerializerMethodField()
    
    # 2. Campus Coordinates (Direct lookup, static public data)
    campus_lat = serializers.FloatField(source='listing.campus.latitude', read_only=True)
    campus_lng = serializers.FloatField(source='listing.campus.longitude', read_only=True)

    class Meta:
        model = ListingLocation
        fields = [
            'id', 
            'lat', 
            'lng', 
            'campus_lat', 
            'campus_lng', 
            'is_approximate',
        ]

    def _has_confirmed_booking(self, obj) -> bool:
        request = self.context.get('request')
        if not request or not request.user == obj.listing.landlord.user or not request.user.is_staff:
            return False
        return True

    def get_is_approximate(self, obj) -> bool:
        return not self._has_confirmed_booking(obj)

    def get_lat(self, obj) -> float:
        # Graceful handling if location hasn't been created yet
        if not hasattr(obj, 'location'): return 0.0
        
        if self._has_confirmed_booking(obj):
            return obj.location.latitude
        return obj.location.fuzzy_latitude

    def get_lng(self, obj) -> float:
        if not hasattr(obj, 'location'): return 0.0
        
        if self._has_confirmed_booking(obj):
            return obj.location.longitude
        return obj.location.fuzzy_longitude
