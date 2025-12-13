from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from listings.models import Listing, Room, ListingLocation

@registry.register_document
class ListingDocument(Document):
    # --- 1. FILTER FIELDS (Flat & Fast) ---
        # --- 1. FILTERING FIELDS (Hidden, used for search logic) ---
    id = fields.IntegerField()
    campus_id = fields.IntegerField(attr='campus_id')
    neighborhood_id = fields.IntegerField(attr='neighborhood_id')
    
    # Flat list of amenity names for easy filtering: ?amenities=wifi&amenities=solar
    amenity_names = fields.KeywordField() 

    # --- 2. DISPLAY FIELDS ---
    title = fields.TextField()
    description = fields.TextField()
    distance_from_campus = fields.DoubleField()
    is_active = fields.BooleanField()
    is_locked = fields.BooleanField()
    created_at = fields.DateField()
    
    # Use ObjectField for Display (Rich Data)
    landlord = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'company_name': fields.KeywordField(),
        'account_type': fields.KeywordField(),
        'is_verified': fields.BooleanField(),
    })

    campus = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.KeywordField(),
        'city': fields.ObjectField(properties={'name': fields.KeywordField()}),
    })

    neighborhood = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.KeywordField(),
    })

    # Images (Lightweight)
    images = fields.ObjectField(properties={
        'display_image': fields.KeywordField(),
        'is_face_image': fields.BooleanField(),
        'caption': fields.KeywordField()
    })

    # Amenities (Rich Object for Display)
    amenities = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'display_name': fields.KeywordField(),
        'category': fields.ObjectField(properties={'name': fields.KeywordField()}),
        'name': fields.KeywordField(),
    })

    # --- 3. COMPLEX ROOM LOGIC ---
    rooms = fields.NestedField(properties={
        'id': fields.IntegerField(),
        'rent_value': fields.DoubleField(),
        'rent_display': fields.KeywordField(),
        'gender_preference': fields.KeywordField(),
        'searchable_genders': fields.KeywordField(multi=True),
        'max_occupants': fields.IntegerField(),
        'current_occupants': fields.IntegerField(),
        'is_full': fields.BooleanField(),
        'has_vacancy': fields.BooleanField(),
    })
    
    # --- 4. LOCATION FIELDS ---
    # Public/Fuzzy Location (Safe for Frontend & Map Display)
    location = fields.GeoPointField()
    
    # Campus Location (Lon & Lat)
    campus_location = fields.ObjectField()
    
    # --- DOCUMENT SETTINGS & OPTIMIZATIONS ---

    class Index:
        name = 'listings'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = Listing
        related_models = [Room, ListingLocation]

    def get_queryset(self):
        # Massive Optimization: Fetch everything needed for indexing in 1 go
        return super().get_queryset().select_related(
            'landlord', 'campus__city', 'neighborhood', 'location'
        ).prefetch_related(
            'rooms', 'amenities', 'images', 'campus__agent'
        )
    
    def get_indexing_queryset(self):
        """
        Overridden to enforce a chunk_size.
        Django raises ValueError if .iterator() is called on a prefetched 
        queryset without a chunk_size.
        """
        qs = self.get_queryset()
        # 100 is a safe batch size. It fetches 100 Listings + all their 
        # related Rooms/Amenities at once, indexes them, then clears memory.
        return qs.iterator(chunk_size=100)

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, Room):
            return related_instance.listing
        if isinstance(related_instance, ListingLocation):
            return related_instance.listing
        return None

    # --- DATA PREPARATION ---

    def prepare_amenity_names(self, instance):
        """Flat list for filtering: ['wifi', 'borehole']"""
        return [a.name for a in instance.amenities.all()]

    def prepare_amenities(self, instance):
        """Rich objects for display"""
        return [{
            'id': a.id,
            'display_name': a.display_name,
            'category': {
                'name': a.category.name
            },
            'name': a.name
        } for a in instance.amenities.all()]

    def prepare_landlord(self, instance):
        l = instance.landlord
        return {
            'id': l.id,
            'company_name': l.company_name,
            'account_type': getattr(l, 'account_type', 'individual'),
            'is_verified': getattr(l, 'is_verified', False),
        }

    def prepare_campus(self, instance):
        return {
            'id': instance.campus.id,
            'name': instance.campus.name,
            'city': {'name': instance.campus.city.name}
        }
    
    # --- DATA PREPARATION (LOCATION) ---

    def prepare_location(self, instance):
        """
        Returns the FUZZY coordinates.
        This is what the frontend will receive in the _source.
        """
        # Safety check if location object exists
        if hasattr(instance, 'location') and instance.location:
            return {
                'lat': instance.location.fuzzy_latitude,
                'lon': instance.location.fuzzy_longitude
            }
        return None
    
    def prepare_campus_location(self, instance):
        if hasattr(instance, 'campus') and (instance.campus.latitude and instance.campus.longitude):
            return {
                'lat': instance.campus.latitude or 0,
                'lon': instance.campus.longitude or 0
            }


    def prepare_images(self, instance):
        # Only index necessary image data to keep index size down
        return [{
            'display_image': img.display_image.url if img.display_image else img.image.url,
            'is_face_image': img.is_face_image,
            'caption': img.caption
        } for img in instance.ordered_images]

    def prepare_rooms(self, instance):
        data = []
        for room in instance.rooms.all():
            
            # --- THE MAGIC LOGIC ---
            # Pre-calculate who can stay here.
            # 1. Exact match always works.
            allowed_genders = [room.gender_preference] 
            
            # 2. Business Rule: "Any" and Empty = Anyone
            if room.gender_preference == 'any' and room.current_occupants == 0:
                allowed_genders.extend(['male', 'female'])
            
            data.append({
                'id': room.id,
                'rent_value': float(room.rent_per_month),
                'rent_display': str(room.rent_per_month),
                'gender_preference': room.gender_preference,
                'searchable_genders': list(set(allowed_genders)), # Remove duplicates
                'max_occupants': room.max_occupants,
                'current_occupants': room.current_occupants,
                'is_full': room.is_full,
                'has_vacancy': room.has_vacancy,
            })
        return data
