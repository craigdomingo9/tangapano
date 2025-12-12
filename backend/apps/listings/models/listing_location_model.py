import math
import random
from django.db import models
from .listing_model import Listing

class ListingLocation(models.Model):
    """
    Stores coordinate data separately.
    Benefits:
    1. Performance: Listing table is lighter.
    2. Security: Can be excluded from generic API serializers easily.
    3. Logic: Encapsulates the privacy math.
    """
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name="location")
    
    # Real Coordinates (Strictly Private)
    latitude = models.FloatField()
    longitude = models.FloatField()

    # Fuzzy Coordinates (Public Display)
    fuzzy_latitude = models.FloatField(blank=True, null=True)
    fuzzy_longitude = models.FloatField(blank=True, null=True)

    def _generate_fuzzy_coords(self):
        """Generates random point in 200m-500m annulus."""
        R_MIN, R_MAX = 200, 500
        DEG_TO_RAD = math.pi / 180

        # Uniform distribution logic
        u = random.random()
        r = math.sqrt(u * (R_MAX**2 - R_MIN**2) + R_MIN**2)
        theta = random.random() * 2 * math.pi

        dy = r * math.cos(theta)
        dx = r * math.sin(theta)

        new_lat = self.latitude + (dy / 111320)
        # Adjust longitude delta based on latitude
        cos_lat = math.cos(self.latitude * DEG_TO_RAD)
        new_lon = self.longitude + (dx / (111320 * cos_lat))

        return new_lat, new_lon

    def save(self, *args, **kwargs):
        # Anti-Jitter: Only regenerate if real coords change
        if self.pk:
            old = ListingLocation.objects.get(pk=self.pk)
            changed = (old.latitude != self.latitude or old.longitude != self.longitude)
        else:
            changed = True

        if changed or not self.fuzzy_latitude:
            self.fuzzy_latitude, self.fuzzy_longitude = self._generate_fuzzy_coords()

        super().save(*args, **kwargs)
