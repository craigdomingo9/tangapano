from django.db import models
from .city_model import City

class Neighborhood(models.Model):
    name = models.CharField(max_length=255)
    city = models.ForeignKey(City, null=True, on_delete=models.PROTECT, related_name='neighborhoods')
    
    
    @property
    def has_listings(self):
        return self.neighborhood_listings.exists()

    def __str__(self):
        return self.name
    