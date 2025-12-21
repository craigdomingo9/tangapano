# analytics/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from interests.models import Interest
from analytics.models import ListingStat

@receiver(post_save, sender=Interest)
def increment_inquiry_stat(sender, instance, created, **kwargs):
    """
    When a new Interest (Inquiry) is created, atomically increment
    the total_inquiries counter on the ListingStat model.
    """
    if created:
        # NOTE: Staff exclusion for inquiries is currently disabled because the user
        # field was removed from the Interest model.
        try:
            # Traverse: Interest -> Room -> Listing
            listing = instance.room.listing
            
            # 1. Ensure the Stat object exists (Defensive programming)
            stat, _ = ListingStat.objects.get_or_create(listing=listing)
            
            # 2. Atomic Increment using F() to prevent race conditions
            # This is SQL level: UPDATE analytics_listingstat SET total_inquiries = total_inquiries + 1
            ListingStat.objects.filter(pk=stat.pk).update(total_inquiries=F('total_inquiries') + 1)
            
        except Exception as e:
            # Analytics failures should never crash the main inquiry flow
            print(f"Error updating analytics for inquiry {instance.id}: {e}")

@receiver(post_delete, sender=Interest)
def decrement_inquiry_stat(sender, instance, **kwargs):
    """
    If an inquiry is deleted (e.g. spam cleanup), decrement the counter.
    """
    try:
        listing = instance.room.listing
        
        # Only decrement if count is > 0 to avoid negative numbers
        ListingStat.objects.filter(
            listing=listing, 
            total_inquiries__gt=0
        ).update(total_inquiries=F('total_inquiries') - 1)
        
    except Exception:
        pass