from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from interests.models import Interest
from listings.serializers import RoomSerializer
from listings.models import Room

class InterestSerializer(ModelSerializer):
    
    class Meta:
        model = Interest
        fields = ['id', 'room', 'contacted_agent', 'timestamp', 'full_name', 'student_id', 'phone_number', 'year_of_study', 'program', 'room_id', 'move_in_timeline', 'deposit_readiness', 'payment_method', 'agree_to_terms']
        read_only_fields = ('id', 'timestamp',)

