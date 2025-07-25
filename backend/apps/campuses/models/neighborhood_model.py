from django.db import models

class Neighborhood(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    
    @property
    def has_listings(self):
        return self.neighborhood_listings.exists()

    def __str__(self):
        return self.name
    