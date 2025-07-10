from rest_framework import serializers
from listings.models import ListingImage

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate(self, attrs):
        if not attrs.get('image'):
            raise serializers.ValidationError("Image field is required.")
        return attrs

