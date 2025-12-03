from django.db import models, transaction
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
        options={'quality': 100}
    )
    
    caption = models.CharField(max_length=255, blank=True, null=True)
    is_face_image = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Listing Images"

    def __str__(self):
        return f"Image for {self.listing.title}"

    def save(self, *args, **kwargs):
        """
        Overrides the save method to:
        1. Automatically set the *first* image uploaded for a listing 
           as the face image.
        2. Ensure only one 'is_face_image' is True per listing when 
           one is *manually* set.
        """
        # 1. Check if this is a new image being created (pk is None)
        is_new = self.pk is None
        
        if is_new:
            has_other_images = ListingImage.objects.filter(
                listing=self.listing
            ).exists()
            
            if not has_other_images:
                self.is_face_image = True

        # 2. Handle manual selection or the auto-setting from step 1
        # This logic ensures uniqueness
        if self.is_face_image:
            with transaction.atomic():
                # Find any other image for the same listing that is
                # currently the face image and set it to False.
                ListingImage.objects.filter(
                    listing=self.listing, 
                    is_face_image=True
                ).exclude(pk=self.pk).update(is_face_image=False)
        
        super().save(*args, **kwargs)

