import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from listings.models import ListingImage


def delete_file(file_field):
    """Safely delete a file from the filesystem."""
    if file_field and file_field.path and os.path.isfile(file_field.path):
        os.remove(file_field.path)


@receiver(pre_save, sender=ListingImage)
def delete_old_image_on_update(sender, instance, **kwargs):
    """Delete the old image file when a new one is uploaded."""
    if not instance.pk:
        return  # new image being created

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    old_image = old_instance.image
    new_image = instance.image

    if old_image and old_image != new_image:
        delete_file(old_image)


@receiver(post_delete, sender=ListingImage)
def delete_image_on_delete(sender, instance, **kwargs):
    """Delete image file when the ListingImage instance is deleted."""
    delete_file(instance.image)
