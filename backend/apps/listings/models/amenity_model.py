from django.db import models
from .amenity_category_model import Category

class Amenity(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True, blank=True, related_name='amenities')
    display_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.display_name
