from rest_framework import serializers
from interests.models import Interest
from listings.serializers import RoomSerializer
from users.serializers import AgentSerializer

class InterestReadSerializer(serializers.ModelSerializer):
    listing = serializers.SerializerMethodField()
    room = RoomSerializer()
    contacted_agent = AgentSerializer()

    class Meta:
        model = Interest
        fields = [
            'id', 'listing', 'full_name', 'student_id', 'phone_number', 
            'year_of_study', 'program', 'room', 'contacted_agent',
            'move_in_timeline', 'deposit_readiness', 'payment_method', 
            'agree_to_terms', 'timestamp'
        ]
    
    def get_listing(self, obj):
        from listings.serializers import ListingSummarySerializer
        room = obj.room
        listing = room.listing
        return ListingSummarySerializer(listing).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        data['move_in_timeline'] = {
            "key": instance.move_in_timeline,
            "value": instance.get_move_in_timeline_display()
        }
        data['deposit_readiness'] = {
            "key": instance.deposit_readiness,
            "value": instance.get_deposit_readiness_display()
        }
        data['payment_method'] = {
            "key": instance.payment_method,
            "value": instance.get_payment_method_display()
        }
        
        return data


