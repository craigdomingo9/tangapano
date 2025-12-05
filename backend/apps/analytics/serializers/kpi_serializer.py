from rest_framework import serializers



class KPISerializer(serializers.Serializer):
    dau = serializers.IntegerField()
    occupancy_rate = serializers.FloatField()
    mrr = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_users = serializers.IntegerField()
    pending_verifications = serializers.IntegerField()
