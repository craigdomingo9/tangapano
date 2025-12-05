from rest_framework import serializers



class GrowthChartSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()

