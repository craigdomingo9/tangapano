from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.users.models import User, Landlord, Agent


# @receiver(post_save, sender=User)
# def create_account_based_on_role(sender, instance, created, **kwargs):
#     if created:
        # if instance.role == 'landlord':
        #     Landlord.objects.create(user=instance)
        # if instance.role == 'agent':
        #     Agent.objects.create(user=instance)

