import random
from datetime import timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count
from tqdm import tqdm
from faker import Faker

# Models
from users.models import User
from listings.models import Listing
from analytics.models import UserSession, ListingViewEvent, ListingStat
from interests.models import Interest

fake = Faker()

class Command(BaseCommand):
    help = "Generates synthetic analytics data (Sessions, Views, Devices) for the Dashboard."

    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=30, help='How many days of history to generate')

    @transaction.atomic
    def handle(self, *args, **options):
        days = options['days']
        
        # 1. Validation
        if not Listing.objects.exists():
            self.stdout.write(self.style.ERROR("🚫 No Listings found. Run 'seed_listings' first."))
            return
        
        # 2. Cleanup Old Analytics
        self.stdout.write(self.style.WARNING("🧹 Wiping old Analytics Data..."))
        UserSession.objects.all().delete()
        ListingViewEvent.objects.all().delete()
        # We don't delete ListingStat, we reset them later
        
        # 3. Setup Simulation Data
        users = list(User.objects.all())
        listings = list(Listing.objects.all())
        
        # Define "Hot Properties" (10% of listings get 60% of traffic)
        hot_listings = random.sample(listings, k=max(1, int(len(listings) * 0.1)))
        regular_listings = [l for l in listings if l not in hot_listings]

        # User Agents for Demographics
        desktop_uas = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
        ]
        mobile_uas = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
        ]

        self.stdout.write(f"📈 Generating {days} days of traffic history...")

        total_sessions = 0
        total_views = 0

        # 4. Time Travel Loop
        for day_offset in tqdm(range(days, -1, -1), desc="Simulating Days"):
            current_date = timezone.now().date() - timedelta(days=day_offset)
            
            # A. Calculate Traffic Volume (Linear Growth Trend)
            # 30 days ago = 20 visitors. Today = 100 visitors.
            growth_factor = (days - day_offset) / days  # 0.0 to 1.0
            base_traffic = 20
            daily_visitors = int(base_traffic + (growth_factor * 80))
            
            # Add randomness (+/- 20%)
            daily_visitors = int(daily_visitors * random.uniform(0.8, 1.2))

            for _ in range(daily_visitors):
                # B. Create User Session
                is_logged_in = random.random() < 0.3 # 30% Logged In
                is_mobile = random.random() < 0.6    # 60% Mobile
                
                user = random.choice(users) if (is_logged_in and users) else None
                ua = random.choice(mobile_uas) if is_mobile else random.choice(desktop_uas)
                session_key = fake.uuid4()

                UserSession.objects.create(
                    session_key=session_key,
                    user=user,
                    ip_address=fake.ipv4(),
                    user_agent=ua,
                    date=current_date,
                    hit_count=random.randint(1, 15)
                )
                total_sessions += 1

                # C. Simulate Listing Views (Funnel)
                # 70% of visitors view at least one listing
                if random.random() < 0.7:
                    views_count = random.randint(1, 5)
                    for _ in range(views_count):
                        # Pick listing (Weighted towards hot properties)
                        if random.random() < 0.6:
                            target = random.choice(hot_listings)
                        else:
                            target = random.choice(regular_listings)

                        # Create Event
                        # Note: We assign a random time within that day
                        random_time = timezone.now() - timedelta(days=day_offset) - timedelta(hours=random.randint(0, 23))
                        
                        ListingViewEvent.objects.create(
                            listing=target,
                            user=user,
                            session_key=session_key,
                            timestamp=random_time,
                            source=random.choice(['direct', 'search', 'social', 'email'])
                        )
                        total_views += 1

        # 5. Re-Aggregate Stats (To ensure ListingStats matches Events perfectly)
        self.stdout.write("🔄 Recalculating aggregated stats...")
        
        # Reset all to 0
        ListingStat.objects.update(total_views=0, total_inquiries=0)

        # Bulk update views
        # This query groups events by listing and counts them
        view_counts = ListingViewEvent.objects.values('listing').annotate(count=Count('id'))
        
        for entry in tqdm(view_counts, desc="Updating ListingStats"):
            listing_id = entry['listing']
            count = entry['count']
            
            stat, _ = ListingStat.objects.get_or_create(listing_id=listing_id)
            stat.total_views = count
            stat.save()

        # Update inquiries from Interest model (if any exist)
        interest_counts = Interest.objects.values('room__listing').annotate(count=Count('id'))
        for entry in interest_counts:
            listing_id = entry['room__listing']
            if listing_id:
                count = entry['count']
                stat, _ = ListingStat.objects.get_or_create(listing_id=listing_id)
                stat.total_inquiries = count
                stat.save()

        self.stdout.write(self.style.SUCCESS(f"✅ Analytics Seeded! Sessions: {total_sessions}, Views: {total_views}"))