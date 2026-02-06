from django.db import models
from django.db.models import Q, F

class Room(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('any', 'Any'), # Implies "Unit", takes first come first serve
        ('mixed', 'Mixed')
    ]

    listing = models.ForeignKey("listings.Listing", on_delete=models.CASCADE, related_name="rooms")
    max_occupants = models.PositiveIntegerField(default=1)
    current_occupants = models.PositiveIntegerField(default=0)
    rent_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    gender_preference = models.CharField(max_length=50, choices=GENDER_CHOICES)
    room_name = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=['listing', 'rent_per_month', 'gender_preference']),
        ]

    def __str__(self):
        return f"{self.listing.title} - {self.gender_preference}"

    @property
    def is_full(self):
        return self.current_occupants >= self.max_occupants

    @property
    def has_vacancy(self):
        return self.current_occupants < self.max_occupants

    @property
    def agent_fee(self):
        # Optimization: Use prefetch_related in Views to avoid N+1 here
        if not self.listing.campus.agent:
            return 0
        general_fee = self.listing.campus.agent.agent_fee or 0
        if self.max_occupants == 1:
            return int(general_fee) * 2
        return general_fee
