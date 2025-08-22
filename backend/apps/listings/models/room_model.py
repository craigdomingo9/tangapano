from django.db import models



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

    def __str__(self):
        return f"{self.listing.title} - {self.max_occupants} person room"
    
    @property
    def is_full(self):
        return self.current_occupants >= self.max_occupants
    
