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
    apply_agent_fee = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    distance_from_campus = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listings"
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=['campus', 'neighborhood', 'is_active', 'created_at'],
                name='listing_main_filter_idx'
            ),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return self.title

    @property
    def ordered_images(self):
        """
        Returns a queryset of all images for this listing,
        with the face image (if any) appearing first.
        """
        return self.images.all().order_by('-is_face_image', 'created_at')

