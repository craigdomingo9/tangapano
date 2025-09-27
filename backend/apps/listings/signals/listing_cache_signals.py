from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from listings.models import Listing, Room


@receiver([post_save, post_delete], sender=Listing)
@receiver([post_save, post_delete], sender=Room)
def invalidate_listings_cache(sender, instance, **kwargs):
    """
    Invalidate all listings cache when listings or rooms are modified
    """
    cache.delete('*listings_list*')


@receiver(post_save, sender=Listing)
@receiver(post_delete, sender=Listing)
def invalidate_listing_cache(sender, instance, **kwargs):
    cache_key = f'listing_{instance.id}_v1'
    cache.delete(cache_key)
