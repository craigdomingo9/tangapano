from django.db import models

class Amenity(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    display_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.display_name
