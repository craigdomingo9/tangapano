from django.db import models
from campuses.models import Campus, Neighborhood


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
    distance_from_campus = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listings"

    def __str__(self):
        return self.title
