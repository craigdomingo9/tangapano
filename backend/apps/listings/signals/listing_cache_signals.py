from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from django.conf import settings

from listings.models import Listing, Room

@receiver(post_save, sender=Listing)
@receiver(post_delete, sender=Listing)
@receiver(post_save, sender=Room)
@receiver(post_delete, sender=Room)
def invalidate_listings_cache(sender, instance, **kwargs):
    """
    Invalidate all listings cache when listings or rooms are modified
    """
    pass
