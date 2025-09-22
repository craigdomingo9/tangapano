# Command for deleting all the fake landlords from the database. This then results in their listings being deleted too.
from django.core.management.base import BaseCommand
from users.models import Landlord, User
import logging
from django.db import transaction

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Delete all fake landlords user accounts and their listings from the database'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        logger.info('Starting deletion of fake landlords and their listings.')
        fake_landlords = User.objects.filter(role='landlord', username__startswith='landlord_')
        count = fake_landlords.count()

        if count == 0:
            self.stdout.write(self.style.WARNING('No fake landlords found to delete.'))
            logger.info('No fake landlords found to delete.')
            return
        try:
            fake_landlords.delete()
        except Exception as e:
            logger.error(f'Error occurred while deleting fake landlords: {e}')
            self.stdout.write(self.style.ERROR('An error occurred while deleting fake landlords. Check logs for details.'))
            return
        logger.info(f'Successfully deleted {count} fake landlords and their listings.')
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} fake landlords and their listings.'))


