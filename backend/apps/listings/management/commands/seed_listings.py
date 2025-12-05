from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import transaction
from tqdm import tqdm
from faker import Faker
import random
import os
from django.core.files import File
from listings.models import Listing, Amenity, Room, ListingImage
from campuses.models import Campus
from django.utils import timezone
from datetime import timedelta
from users.models import Landlord, User
from billing.models import Tier, Subscription
from notifications.models import Notification

fake = Faker()

class Command(BaseCommand):
    help = "Populate database with Landlords, Listings, and Rooms."

    def add_arguments(self, parser):
        parser.add_argument('--landlords', type=int, default=20)
        parser.add_argument('--listings', type=int, default=3)

    @transaction.atomic
    def handle(self, *args, **options):
        # 1. Safety Check: Do we have Campuses?
        if not Campus.objects.exists():
            self.stdout.write(self.style.WARNING("⚠️  No Campuses found. Running seed_production_data first..."))
            call_command('seed_production_data')

        self.stdout.write(self.style.WARNING("🧹 Wiping old Listings/Rooms/Landlords (Fresh Start)..."))
        Listing.objects.all().delete()
        Landlord.objects.all().delete()
        User.objects.filter(role="landlord").delete()
        Subscription.objects.all().delete()
        Notification.objects.all().delete()

        # Load References
        campuses = list(Campus.objects.all())
        amenities = list(Amenity.objects.all())
        tiers = list(Tier.objects.all())
        
        if not tiers:
            self.stdout.write(self.style.ERROR("🚫 No Tiers found. Update seed_production_data.py first."))
            return
        
        landlords_count = options['landlords']
        listings_per_landlord = options['listings']

        self.stdout.write(f"🚀 Generating {landlords_count} Landlords with {listings_per_landlord} listings each...")

        # 2. Iterate
        for i in tqdm(range(landlords_count), desc="Seeding"):
            # A. Create Landlord User
            user = User.objects.create_user(
                username=f'landlord_{i}',
                email=fake.unique.email(),
                password="password123",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                role="landlord"
            )

            # B. Create Landlord Profile (Randomize Agency vs Individual)
            is_agency = random.choice([True, False, False]) # 33% chance of Agency
            landlord = Landlord.objects.create(
                user=user,
                phone_number=fake.phone_number(),
                company_name=fake.company() if is_agency else None,
                account_type='agency' if is_agency else 'individual',
                is_verified=random.choice([True, False]),
                address=fake.address()
            )
            
            # -----------------------------------------------------
            # Create Subscription
            # -----------------------------------------------------
            # 60% Active, 20% Expired, 20% Pending
            status_roll = random.random()
            if status_roll < 0.6:
                sub_status = 'active'
                start_dt = timezone.now() - timedelta(days=random.randint(1, 20))
                end_dt = start_dt + timedelta(days=30)
            elif status_roll < 0.8:
                sub_status = 'expired'
                start_dt = timezone.now() - timedelta(days=60)
                end_dt = timezone.now() - timedelta(days=10)
            else:
                sub_status = 'pending'
                start_dt = timezone.now()
                end_dt = None
            
            # Agencies usually get Pro, Individuals get Standard/Free
            selected_tier = tiers[2] if is_agency else random.choice(tiers[:2])
            
            Subscription.objects.create(
                landlord=landlord,
                tier=selected_tier,
                status=sub_status,
                start_date=start_dt,
                end_date=end_dt,
                transaction_ref=fake.uuid4() if sub_status == 'active' else None
            )
            
            # -----------------------------------------------------
            # Create Notifications
            # -----------------------------------------------------
            # Generate 1-5 notifications per user
            for _ in range(random.randint(1, 5)):
                n_type = random.choice(['info', 'success', 'warning'])
                category = random.choice(['billing', 'listing', 'inquiry', 'system'])
                
                titles = {
                    'billing': ["Invoice Paid", "Subscription Expiring Soon", "Payment Failed"],
                    'listing': ["Listing Approved", "Please update your listing", "Listing Locked"],
                    'inquiry': ["New Student Inquiry", "Message from Admin"],
                    'system': ["Maintenance Scheduled", "Welcome to Tangapano"]
                }
                
                Notification.objects.create(
                    recipient=user,
                    title=random.choice(titles[category]),
                    message=fake.sentence(),
                    notification_type=n_type,
                    category=category,
                    is_read=random.choice([True, False])
                )

            # C. Create Listings
            for _ in range(listings_per_landlord):
                campus = random.choice(campuses)
                # CRITICAL: Listing Neighborhood MUST belong to Campus City
                valid_neighborhoods = list(campus.neighborhoods.all())
                if not valid_neighborhoods:
                    continue # Skip if campus has no hoods linked
                
                neighborhood = random.choice(valid_neighborhoods)

                listing = Listing.objects.create(
                    title=f"{fake.word().capitalize()} Court @ {neighborhood.name}",
                    description=fake.text(max_nb_chars=150),
                    campus=campus,
                    neighborhood=neighborhood,
                    landlord=landlord,
                    distance_from_campus=random.choice([0.5, 1.2, 3.0, 5.5]),
                    apply_agent_fee=True,
                    is_active=True
                )

                # D. Add Images
                self._add_fake_images(listing)

                # E. Add Amenities (Random subset)
                if amenities:
                    k = random.randint(4, 10)
                    listing.amenities.set(random.sample(amenities, k=min(k, len(amenities))))

                # F. Create Rooms (The Business Logic)
                self._create_rooms(listing)

        self.stdout.write(self.style.SUCCESS("✅ Database seeded! Run 'python manage.py search_index --rebuild' next."))

    def _create_rooms(self, listing):
        """Creates rooms with specific logic to test Elasticsearch."""
        for _ in range(random.randint(2, 6)):
            max_occ = random.choice([1, 2, 2, 4]) # Weighted towards 2-sharing
            
            # Scenario 1: Empty Room (Should show for ANY gender search)
            if random.random() < 0.3:
                curr_occ = 0
                gender = "any" # Important for testing index logic
            # Scenario 2: Full Room (Should NOT show unless is_full=true)
            elif random.random() < 0.2:
                curr_occ = max_occ
                gender = random.choice(["male", "female"])
            # Scenario 3: Partial Room
            else:
                curr_occ = max_occ - 1 if max_occ > 1 else 0
                gender = random.choice(["male", "female"])

            base_rent = 150 if max_occ == 1 else (200 / max_occ)
            
            Room.objects.create(
                listing=listing,
                max_occupants=max_occ,
                current_occupants=curr_occ,
                rent_per_month=base_rent + random.randint(-10, 10),
                gender_preference=gender,
                is_active=True
            )

    def _add_fake_images(self, listing):
        """Looks for images in a local 'fake-images' folder."""
        fake_image_dir = os.path.join(os.getcwd(), 'fake-images')
        if not os.path.exists(fake_image_dir):
            return

        valid_exts = ('.png', '.jpg', '.jpeg', '.webp')
        images = [f for f in os.listdir(fake_image_dir) if f.lower().endswith(valid_exts)]
        
        if images:
            # Add 1-3 images per listing
            for _ in range(random.randint(1, 3)):
                fname = random.choice(images)
                fpath = os.path.join(fake_image_dir, fname)
                with open(fpath, 'rb') as f:
                    ListingImage.objects.create(
                        listing=listing,
                        image=File(f, name=fname),
                        caption=random.choice(["Bedroom", "Exterior", "Kitchen"])
                    )