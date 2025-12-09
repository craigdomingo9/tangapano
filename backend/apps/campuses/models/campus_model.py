from django.db import models
from campuses.models.neighborhood_model import Neighborhood
from .city_model import City

class Campus(models.Model):
    name = models.CharField(max_length=255, unique=True)
    city = models.ForeignKey(City, null=True, on_delete=models.PROTECT, related_name='campuses')
    
    agent = models.ForeignKey(
        "users.Agent",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campus"
    )
    
    neighborhoods = models.ManyToManyField(Neighborhood, related_name="campuses", blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    @property
    def has_listings(self):
        return self.campus_listings.exists()
    
    class Meta:
        verbose_name_plural = "Campuses"
