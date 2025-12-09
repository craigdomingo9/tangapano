from rest_framework import serializers
from campuses.models import City

class CitySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']