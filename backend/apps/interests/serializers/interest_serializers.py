from rest_framework import serializers
from interests.models import Interest

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = [
            'id', 'room', 'timestamp', 
            'full_name', 'student_id', 'phone_number', 
            'year_of_study', 'program', 
            'move_in_timeline', 'deposit_readiness', 'payment_method', 
            'agree_to_terms', 'contacted_agent'
        ]
        read_only_fields = ('id', 'timestamp', 'contacted_agent')

    def create(self, validated_data):
        """
        Auto-assign the Agent based on the Room's Campus.
        This prevents students from messaging the wrong agent or spoofing the ID.
        """
        room = validated_data.get('room')
        agent = None
        
        # Traverse: Room -> Listing -> Campus -> Agent
        # We use getattr/if checks to avoid crashes if a Listing has no Campus assigned
        if room.listing.campus and room.listing.campus.agent:
            agent = room.listing.campus.agent
            
        validated_data['contacted_agent'] = agent
        
        return super().create(validated_data)