from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from listings.models import Amenity


@receiver([post_save, post_delete], sender=Amenity)
def invalidate_amenity_cache(sender, instance, **kwargs):
    """
    Invalidate all amenity cache when amenities are modified
    """
    cache.delete('*amenity_list*')
