from django.db import models
from campuses.models.neighborhood_model import Neighborhood
from .city_model import City

class Campus(models.Model):
    name = models.CharField(max_length=255, unique=True)
    city = models.ForeignKey(City, null=True, on_delete=models.PROTECT, related_name='campuses')
    neighborhoods = models.ManyToManyField(Neighborhood, related_name="campuses", blank=True)
    
    agent = models.ForeignKey(
        "users.Agent",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campus"
    )
    
    # Physical Location (Public Data - No Privacy Needed)
    address = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(help_text="Exact GPS Latitude")
    longitude = models.FloatField(help_text="Exact GPS Longitude")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Campuses"
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self):
        return self.name
    
    @property
    def has_listings(self):
        return self.campus_listings.exists()
    
    class Meta:
        verbose_name_plural = "Campuses"
