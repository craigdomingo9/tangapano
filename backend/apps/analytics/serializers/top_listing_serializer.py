from rest_framework import serializers
from analytics.models import ListingStat


class TopListingSerializer(serializers.ModelSerializer):
    """
    Used for the 'Hot Properties' list.
    """
    title = serializers.CharField(source='listing.title')
    campus = serializers.CharField(source='listing.campus.name')
    
    class Meta:
        model = ListingStat
        fields = ['id', 'title', 'campus', 'total_views', 'total_inquiries']
