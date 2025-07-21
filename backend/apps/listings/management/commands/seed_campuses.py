from django.core.management.base import BaseCommand
from campuses.models import Campus, Neighborhood
from users.models import User, Agent


class Command(BaseCommand):
    help = "Deletes all campuses and neighborhoods and seeds new Zimbabwean data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🚨 Deleting all campuses and neighborhoods..."))
        Neighborhood.objects.all().delete()
        Campus.objects.all().delete()
        Agent.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write("🌍 Seeding Zimbabwean campuses and neighborhoods...")

        self.stdout.write("Creating campuses and neighborhoods...")
        campus_names = [
            "University of Zimbabwe", "Midlands State University", "Great Zimbabwe University",
            "Chinhoyi University", "Lupane State University"
        ]
        cities = ["Harare", "Gweru", "Masvingo", "Chinhoyi", "Lupane"]

        
        ZIM_NEIGHBORHOODS = {
            "Harare": ["Avondale", "Borrowdale", "Mbare", "Greendale", "Mount Pleasant", "Waterfalls"],
            "Gweru": ["Senga KMP", "Senga CBZ", "Adelaide", "Randolph Park", "Mkoba", "Nashville"],
            "Masvingo": ["Mucheke", "Rujeko", "Rhodes", "Junction", "Runyararo"],
            "Chinhoyi": ["Cold Stream", "Hunyani", "Gadzema", "Cherima", "Orange Grove"],
            "Lupane": ["Lupane Center", "Gwayi", "Jotsholo", "Dandanda", "Tshongogwe"],
        }

        for name, city in zip(campus_names, cities):
            campus = Campus.objects.create(name=name, city=city)

            for neighborhood_name in ZIM_NEIGHBORHOODS[city]:
                neighborhood = Neighborhood.objects.create(name=neighborhood_name, city=city)
                campus.neighborhoods.add(neighborhood)

            # Create agent user for this campus
            agent_user = User.objects.create_user(
                username=f"agent_{city.lower()}",
                email=f"agent_{city.lower()}@example.com",
                password="password123",
                first_name="Agent",
                last_name=city,
                role="agent"
            )

            # Create Agent linked to user and campus
            Agent.objects.create(user=agent_user, campus=campus)

        self.stdout.write(self.style.SUCCESS("✅ Campuses, neighborhoods, and agents seeded successfully."))
