from django.db import models
from django.db.models import Q
from campuses.models import Campus, Neighborhood
from .amenity_model import Amenity


class Listing(models.Model):
    landlord = models.ForeignKey(
        "users.Landlord",
        on_delete=models.CASCADE,
        related_name="listings"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    campus = models.ForeignKey(
        Campus,
        on_delete=models.CASCADE,
        related_name="campus_listings"
    )
    neighborhood = models.ForeignKey(
        Neighborhood,
        on_delete=models.CASCADE,
        related_name="neighborhood_listings"
    )
    amenities = models.ManyToManyField(
        Amenity, 
        related_name="listings", 
        blank=True
    )
    distance_from_campus = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listings"
        ordering = ["-created_at"]
        indexes = [
            # Index for campus and neighborhood filters
            models.Index(fields=['campus', 'neighborhood']),
            
            # Composite index for campus with activity status
            models.Index(fields=['campus', 'is_active']),
            
            # Index for created_at (used in ordering)
            models.Index(fields=['-created_at']),
            
            # Partial index for active listings only
            models.Index(
                fields=['campus', 'neighborhood'], 
                condition=Q(is_active=True),
                name='active_listings_location_idx'
            ),
        ]

    def __str__(self):
        return self.title
