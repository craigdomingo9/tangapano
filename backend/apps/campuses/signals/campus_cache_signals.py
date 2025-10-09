from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from campuses.models import Campus, Neighborhood


@receiver([post_delete, post_save], sender=Campus)
@receiver([post_delete, post_save], sender=Neighborhood)
def invalidate_campuses_cache(sender, instance, **kwargs):
    """
    Invalidate all campuses cache when campuses or neighborhoods are modified
    """
    cache.delete('campus_*')
