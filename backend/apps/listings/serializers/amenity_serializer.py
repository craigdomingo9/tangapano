from rest_framework import serializers
from listings.models import Amenity, Category

class AmenityCategorySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'display_name']


class AmenitySerializer(serializers.ModelSerializer):
    category = AmenityCategorySummarySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True, source='category')
    
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'display_name', 'category', 'category_id']
        read_only_fields = ('id', 'category')
