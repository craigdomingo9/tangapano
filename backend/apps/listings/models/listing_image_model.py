from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, Transpose


class ListingImage(models.Model):
    listing = models.ForeignKey(
        "listings.Listing",
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="listing_images/")
    
    display_image = ImageSpecField(
        source='image',
        processors=[Transpose(), ResizeToFill(1200, 800)],
        format='WEBP',
        options={'quality': 85}
    )
    
    caption = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listing Images"

    def __str__(self):
        return f"Image for {self.listing.title}"
