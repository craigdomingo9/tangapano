from django.db import models


class ListingAmenity(models.Model):
    listing = models.ForeignKey(
        "listings.Listing",
        on_delete=models.CASCADE,
        related_name="amenities"
    )
    amenity = models.ForeignKey(
        "listings.Amenity",
        on_delete=models.CASCADE,
        related_name="listings"
    )
    
    class Meta:
        unique_together = ("listing", "amenity")
        verbose_name_plural = "Listing Amenities"
        indexes = [
            models.Index(fields=['amenity']),
            models.Index(fields=['listing']),
        ]
    
    def __str__(self):
        return f"{self.listing} - {self.amenity}"
    