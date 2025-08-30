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
        indexes = [
            # Composite index for the most common filters
            models.Index(fields=['listing', 'rent_per_month', 'gender_preference', 'max_occupants']),
            
            # Index for individual fields that are frequently filtered
            models.Index(fields=['rent_per_month']),
            models.Index(fields=['gender_preference']),
            models.Index(fields=['max_occupants']),
            
            # Composite index for occupancy status (is_full filter)
            models.Index(fields=['max_occupants', 'current_occupants']),
            
            # Composite index for listing with activity status
            models.Index(fields=['listing', 'is_active']),
            
            # Partial index for available rooms (not full)
            models.Index(
                fields=['rent_per_month', 'gender_preference'],
                condition=Q(current_occupants__lt=F('max_occupants')),
                name='available_rooms_filter_idx'
            ),
        ]

    def __str__(self):
        return f"{self.listing.title} - {self.max_occupants} person room"
    
    @property
    def is_full(self):
        return self.current_occupants >= self.max_occupants
    
