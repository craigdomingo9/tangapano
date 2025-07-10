from django.db import models




class ListingImage(models.Model):
    listing = models.ForeignKey(
        "listings.Listing",
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="listing_images/")
    caption = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listing Images"

    def __str__(self):
        return f"Image for {self.listing.title}"
