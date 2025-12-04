from django.db import models
from django.core.exceptions import ValidationError
from campuses.models import Campus, Neighborhood
from .amenity_model import Amenity

class Listing(models.Model):
    landlord = models.ForeignKey("users.Landlord", on_delete=models.CASCADE, related_name="listings")
    
    # Location Hierarchy
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE, related_name="campus_listings")
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.CASCADE, related_name="neighborhood_listings")
    
    # 3NF Relation for Amenities
    amenities = models.ManyToManyField(Amenity, related_name="listings", blank=True)
    
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    apply_agent_fee = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    distance_from_campus = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=['campus', 'neighborhood', 'is_active']),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        """
        Critical Data Integrity: Ensure the Neighborhood actually belongs 
        to the same City as the Campus.
        """
        if self.campus_id and self.neighborhood_id:
            # Note: We rely on the cached objects to avoid extra DB hits if possible
            if self.campus.city_id != self.neighborhood.city_id:
                raise ValidationError("The selected Neighborhood is not in the same city as the Campus.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def ordered_images(self):
        return self.images.all().order_by('-is_face_image', 'created_at')