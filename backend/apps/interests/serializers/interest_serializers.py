from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from interests.models import Interest
from listings.serializers import RoomSerializer
from listings.models import Room

class InterestSerializer(ModelSerializer):
    
    class Meta:
        model = Interest
        fields = ['id', 'room', 'contacted_agent', 'timestamp']
        read_only_fields = ('id', 'timestamp',)

