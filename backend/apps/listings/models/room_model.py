from django.db import models
from django.db.models import Q, F


class Room(models.Model):
    listing = models.ForeignKey(
        "listings.Listing",
        on_delete=models.CASCADE,
        related_name="rooms"
    )
    max_occupants = models.PositiveIntegerField(default=1)
    current_occupants = models.PositiveIntegerField(default=0)
    rent_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    gender_preference = models.CharField(max_length=50, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('any', 'Any'),
        ('mixed', 'Mixed')
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Rooms"
        ordering = ["created_at"]
        indexes = [
            # Primary composite index for most queries
            models.Index(
                fields=['listing', 'rent_per_month', 'gender_preference', 'max_occupants'],
                name='room_main_filter_idx'
            ),
            
            # Optimized index for occupancy checks
            models.Index(
                fields=['listing', 'max_occupants', 'current_occupants'],
                name='room_occupancy_check_idx'
            ),
            
            # Partial index for available rooms (covers both filtering and ordering)
            models.Index(
                fields=['rent_per_month', 'gender_preference'],
                condition=Q(current_occupants__lt=F('max_occupants')),
                name='available_rooms_idx'
            ),
        ]

    def __str__(self):
        return f"{self.listing.title} - {self.max_occupants} person room"
    
    @property
    def is_full(self):
        return self.current_occupants >= self.max_occupants
    
    @property
    def agent_fee(self):
        general_fee = self.listing.campus.agent.agent_fee
        if self.max_occupants == 1:
            return int(general_fee) * 2
        return general_fee
    
    @property
    def room_number(self):
        """
        Alternative: Use room sequence as the room id.
        """
        if not self.id:
            return "TBD"

        from django.db.models import Count
        
        # Get room sequence within listing
        room_sequence = Room.objects.filter(
            listing_id=self.listing_id,
            id__lte=self.id
        ).aggregate(sequence=Count('id'))['sequence']
            
        return room_sequence
    
