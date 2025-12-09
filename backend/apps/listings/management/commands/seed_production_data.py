import os
from django.core.management.base import BaseCommand
from listings.models import Amenity, Category
from users.models import User, Agent
from billing.models import Tier
from campuses.models import Campus, Neighborhood, City
from dotenv import load_dotenv

load_dotenv()

class Command(BaseCommand):
    help = 'Builds the foundation (Cities, Campuses, Amenities) from scratch.'

    def handle(self, *args, **options):
        self.stdout.write("🏗️  Starting foundation build...")

        # ---------------------------------------------------------
        # 1. CITIES, CAMPUSES & AGENTS HIERARCHY
        # ---------------------------------------------------------
        # Data Structure: City -> Campus -> Neighborhoods
        ZIM_LOCATIONS = {
            "Harare": {
                "campuses": ["University of Zimbabwe", "Harare Institute of Technology"],
                "neighborhoods": ["Avondale", "Mbare", "Greendale", "Waterfalls", "Mount Pleasant", "Belvedere"]
            },
            "Gweru": {
                "campuses": ["Midlands State University"],
                "neighborhoods": ["Senga KMP", "Senga CBZ", "Adelaide", "Randolph Park", "Nehosho"]
            },
            "Bulawayo": {
                "campuses": ["NUST"],
                "neighborhoods": ["Selbourne Park", "Khumalo", "Riverside"]
            }
        }

        for city_name, data in ZIM_LOCATIONS.items():
            self.stdout.write(f"  📍 Processing City: {city_name}")
            
            # A. Create City
            city, _ = City.objects.get_or_create(name=city_name)

            # B. Create Neighborhoods (Linked to City)
            for hood_name in data["neighborhoods"]:
                Neighborhood.objects.get_or_create(name=hood_name, city=city)

            # C. Create Agent & Campus
            for campus_name in data["campuses"]:
                # 1. Create Agent User
                agent_username = f"agent_{campus_name.lower().replace(' ', '_')}"
                agent_user, created = User.objects.get_or_create(
                    username=agent_username,
                    defaults={
                        "email": f"{agent_username}@tangapano.com",
                        "first_name": "Agent",
                        "last_name": campus_name,
                        "role": "agent"
                    }
                )
                if created:
                    agent_user.set_password("password123")
                    agent_user.save()

                # 2. Create Agent Profile
                agent, _ = Agent.objects.get_or_create(
                    user=agent_user,
                    defaults={
                        "agency_name": f"{campus_name} Housing Office",
                        "agent_fee": 10.00,
                        "phone_number": "+263777000000",
                    }
                )

                # 3. Create Campus (Linked to City & Agent)
                campus, created = Campus.objects.get_or_create(
                    name=campus_name,
                    defaults={
                        "city": city,
                        "agent": agent,
                        "address": f"Main Campus, {city_name}"
                    }
                )
                
                # 4. Link ALL city neighborhoods to this campus (for simplicity)
                if created:
                    city_hoods = Neighborhood.objects.filter(city=city)
                    campus.neighborhoods.set(city_hoods)

        self.stdout.write(self.style.SUCCESS("✅ Locations & Agents created."))

        # ---------------------------------------------------------
        # 2. AMENITIES (With Categories)
        # ---------------------------------------------------------
        self.stdout.write("  🛁 Creating Amenities...")
        
        # A. Define Categories first
        CATEGORY_DEFINITIONS = {
            'connectivity': 'Connectivity & Utilities',
            'comfort': 'Room Comfort',
            'kitchen': 'Kitchen & Laundry',
            'common': 'Common Areas',
            'recreation': 'Recreation',
            'security': 'Security & Access',
        }

        # Create Category objects
        for slug, display_name in CATEGORY_DEFINITIONS.items():
            Category.objects.get_or_create(
                name=slug,
                defaults={'display_name': display_name}
            )
        
        # B. Define Amenities
        amenities_data = [
            # Connectivity
            {"name": "wifi", "display_name": "WiFi", "category": "connectivity"},
            {"name": "starlink", "display_name": "Starlink Internet", "category": "connectivity"},
            {"name": "backup_power", "display_name": "Solar/Inverter", "category": "connectivity"},
            
            # Comfort
            {"name": "ensuite", "display_name": "Ensuite Bathroom", "category": "comfort"},
            {"name": "tiled", "display_name": "Tiled Floors", "category": "comfort"},
            {"name": "ceiling", "display_name": "Ceiling", "category": "comfort"},
            {"name": "bic", "display_name": "Built-in Cupboards", "category": "comfort"},
            
            # Kitchen
            {"name": "fridge", "display_name": "Refrigerator", "category": "kitchen"},
            {"name": "stove", "display_name": "Gas/Electric Stove", "category": "kitchen"},
            {"name": "microwave", "display_name": "Microwave", "category": "kitchen"},
            
            # Security
            {"name": "gated", "display_name": "Walled & Gated", "category": "security"},
            {"name": "caretaker", "display_name": "On-site Caretaker", "category": "security"},
            {"name": "security_guard", "display_name": "Security Guard", "category": "security"},
            
            # Water
            {"name": "borehole", "display_name": "Borehole Water", "category": "connectivity"},
            {"name": "tank", "display_name": "Water Tank", "category": "connectivity"},
            {"name": "hot_water", "display_name": "Geyser/Hot Water", "category": "comfort"},
        ]

        for item in amenities_data:
            # Lookup the Category object by name (slug)
            category_obj = Category.objects.get(name=item["category"])

            Amenity.objects.get_or_create(
                name=item["name"],
                defaults={
                    "display_name": item["display_name"],
                    "category": category_obj  # Assign actual object, not string
                }
            )

        self.stdout.write(self.style.SUCCESS("✅ Amenities created."))

        # ---------------------------------------------------------
        # 3. SUPERUSER
        # ---------------------------------------------------------
        admin_username = os.getenv("DJANGO_ADMIN_USERNAME", "admin")
        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                email=os.getenv("DJANGO_ADMIN_EMAIL", "admin@example.com"),
                password=os.getenv("DJANGO_ADMIN_PASSWORD", "admin"),
                role="admin"
            )
            self.stdout.write(self.style.SUCCESS(f"✅ Admin created: {admin_username}"))
        else:
            self.stdout.write("ℹ️  Admin already exists.")
        
        # ---------------------------------------------------------
        # 4. BILLING TIERS (NEW SECTION)
        # ---------------------------------------------------------
        self.stdout.write("  💳 Creating Subscription Tiers...")
        
        tiers_data = [
            {
                "name": "Free Starter",
                "slug": "free",
                "price": 0.00,
                "duration_days": 365,
                "max_listings": 1,
                "can_feature": False,
                "verified": False
            },
            {
                "name": "Standard Landlord",
                "slug": "standard",
                "price": 15.00,
                "duration_days": 30,
                "max_listings": 5,
                "can_feature": False,
                "verified": True
            },
            {
                "name": "Agency Pro",
                "slug": "agency_pro",
                "price": 50.00,
                "duration_days": 30,
                "max_listings": 50,
                "can_feature": True,
                "verified": True
            }
        ]

        for t in tiers_data:
            Tier.objects.get_or_create(
                slug=t["slug"],
                defaults={
                    "name": t["name"],
                    "price": t["price"],
                    "duration_days": t["duration_days"],
                    "max_listings": t["max_listings"],
                    "can_feature_listings": t["can_feature"],
                    "is_verified_badge": t["verified"]
                }
            )
        
        self.stdout.write(self.style.SUCCESS("✅ Tiers created."))