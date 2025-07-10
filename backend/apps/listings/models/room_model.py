from django.db import models



class Room(models.Model):
    listing = models.ForeignKey(
        "listings.Listing",
        on_delete=models.CASCADE,
        related_name="rooms"
    )
    room_type = models.CharField(max_length=50, choices=[
        ('single', 'Single'),
        ('double', 'Double'),
        ('shared', 'Shared'),
    ], default='single')
    max_occupancy = models.PositiveIntegerField(default=1)
    current_occupancy = models.PositiveIntegerField(default=0)
    rent_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    gender_preference = models.CharField(max_length=50, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('none', 'None'),
    ])
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Rooms"

    def __str__(self):
        return self.name
