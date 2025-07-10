from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from apps.users.models import User, Landlord, Agent


@receiver(post_save, sender=User)
def create_account_based_on_role(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'landlord':
            Landlord.objects.create(user=instance)
        elif instance.role == 'agent':
            Agent.objects.create(user=instance)

