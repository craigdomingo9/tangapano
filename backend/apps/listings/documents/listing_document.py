from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from listings.models import Listing, Room

@registry.register_document
class ListingDocument(Document):
    # --- 1. FILTERING FIELDS (Hidden, used for search logic) ---
    id = fields.IntegerField()
    campus_filter_id = fields.IntegerField()
    neighborhood_filter_id = fields.IntegerField()
    amenity_filter_names = fields.KeywordField()   # Used for ?amenities=wifi
    
    # --- 2. DISPLAY FIELDS (Rich JSON for Frontend) ---
    
    # Simple Fields
    title = fields.KeywordField()
    description = fields.TextField()
    apply_agent_fee = fields.BooleanField()
    is_locked = fields.BooleanField()
    distance_from_campus = fields.DoubleField()
    is_active = fields.BooleanField()
    created_at = fields.DateField()
    updated_at = fields.DateField()

    # Landlord (Object)
    landlord = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'user': fields.IntegerField(),
        'company_name': fields.KeywordField(),
        'phone_number': fields.KeywordField(),
        'address': fields.KeywordField(),
    })

    # Campus (Deep Nested Object)
    campus = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.KeywordField(),
        'has_listings': fields.BooleanField(),
        'city': fields.KeywordField(),
        # Nested Agent inside Campus
        'agent': fields.ObjectField(properties={
            'id': fields.IntegerField(),
            'user': fields.IntegerField(),
            'agency_name': fields.KeywordField(),
            'agent_fee': fields.KeywordField(), # Keeping as string per your JSON
            'phone_number': fields.KeywordField(),
            'address': fields.KeywordField(),
        }),
        # Nested Neighborhoods inside Campus
        'neighborhoods': fields.ObjectField(properties={
            'id': fields.IntegerField(),
            'name': fields.KeywordField(),
            'city': fields.KeywordField(),
            'has_listings': fields.BooleanField(),
        })
    })

    # Neighborhood (Object)
    neighborhood = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.KeywordField(),
        'city': fields.KeywordField(),
        'has_listings': fields.BooleanField(),
    })

    # Images (List of Objects)
    images = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'image': fields.KeywordField(),
        'display_image': fields.KeywordField(), # Thumbnails
        'is_face_image': fields.BooleanField(),
        'caption': fields.KeywordField(),
        'created_at': fields.DateField(),
        'updated_at': fields.DateField(),
    })

    # Amenities (List of Objects)
    amenities = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.KeywordField(),
        'display_name': fields.KeywordField(),
        'category': fields.KeywordField(),
    })

    # Rooms (List of Objects)
    rooms = fields.NestedField(properties={
        'id': fields.IntegerField(),
        'room_number': fields.IntegerField(),
        'listing': fields.IntegerField(),
        'current_occupants': fields.IntegerField(),
        'is_full': fields.BooleanField(),
        'max_occupants': fields.IntegerField(),
        'rent_per_month': fields.KeywordField(), # String for display
        'rent_value': fields.DoubleField(),      # Float for filtering
        'gender_preference': fields.KeywordField(),
        'is_active': fields.BooleanField(),
        'created_at': fields.DateField(),
        'updated_at': fields.DateField(),
        'has_vacancy': fields.BooleanField(),
        'agent_fee': fields.IntegerField(),
    })

    class Index:
        name = 'listings'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = Listing
        fields = []
        related_models = [Room]
    
    def get_queryset(self):
        return super().get_queryset().prefetch_related('rooms', 'campus__agent')

    # 2. DEFINE HOW TO FIND THE PARENT
    def get_instances_from_related(self, related_instance):
        """
        If a Room is updated, return the Listing it belongs to.
        """
        if isinstance(related_instance, Room):
            return related_instance.listing
        return None

    # --- PREPARE METHODS (The Heavy Lifting) ---

    def prepare_campus_filter_id(self, instance):
        return instance.campus_id

    def prepare_neighborhood_filter_id(self, instance):
        return instance.neighborhood_id

    def prepare_amenity_filter_names(self, instance):
        return [a.name.lower() for a in instance.amenities.all()]

    def prepare_landlord(self, instance):
        if not instance.landlord: return None
        return {
            'id': instance.landlord.id,
            'user': instance.landlord.user.id if instance.landlord.user else None,
            'company_name': instance.landlord.company_name,
            'phone_number': instance.landlord.phone_number,
            'address': instance.landlord.address
        }

    def prepare_campus(self, instance):
        if not instance.campus: return None
        c = instance.campus
        
        # Prepare neighborhoods list for this campus
        neighborhoods_data = []
        if hasattr(c, 'neighborhoods'):
            neighborhoods_data = [{
                'id': n.id, 'name': n.name, 'city': n.city, 'has_listings': n.has_listings
            } for n in c.neighborhoods.all()]

        # Prepare Agent
        agent_data = None
        if c.agent:
            agent_data = {
                'id': c.agent.id,
                'user': c.agent.user.id,
                'agency_name': c.agent.agency_name,
                'agent_fee': str(c.agent.agent_fee),
                'phone_number': c.agent.phone_number,
                'address': c.agent.address,
            }

        return {
            'id': c.id,
            'name': c.name,
            'has_listings': c.has_listings,
            'city': c.city,
            'agent': agent_data,
            'neighborhoods': neighborhoods_data,
            'created_at': c.created_at,
            'updated_at': c.updated_at
        }

    def prepare_neighborhood(self, instance):
        if not instance.neighborhood: return None
        return {
            'id': instance.neighborhood.id,
            'name': instance.neighborhood.name,
            'city': instance.neighborhood.city,
            'has_listings': instance.neighborhood.has_listings
        }

    def prepare_images(self, instance):
        # Use ordered_images if available
        imgs = instance.ordered_images if hasattr(instance, 'ordered_images') else instance.images.all()
        return [{
            'id': img.id,
            'image': img.image.url if img.image else None,
            'display_image': img.display_image.url if hasattr(img, 'display_image') and img.display_image else (img.image.url if img.image else None),
            'is_face_image': img.is_face_image,
            'caption': img.caption,
            'created_at': img.created_at,
            'updated_at': img.updated_at
        } for img in imgs]

    def prepare_amenities(self, instance):
        return [{
            'id': a.id,
            'name': a.name,
            'display_name': a.display_name,
            'category': a.category
        } for a in instance.amenities.all()]

    def prepare_rooms(self, instance):
        """
        Converts the related Room models into a list of dictionaries for Elasticsearch.
        'instance' is the Listing object.
        """
        # 1. Get all rooms for this listing
        rooms = instance.rooms.all()
        
        rooms_data = []

        # 2. Iterate (Use enumerate for room_number to avoid DB hits)
        for index, room in enumerate(rooms, start=1):
            rooms_data.append({
                'id': room.id,
                
                # OPTIMIZATION: Do not use room.room_number here. 
                # Calculating it via Python 'enumerate' is instant.
                # Calculating it via your Model property triggers a new SQL query per room.
                'room_number': index, 
                
                'listing': instance.id,
                'current_occupants': room.current_occupants,
                'max_occupants': room.max_occupants,
                'is_full': room.is_full, # Uses your model property
                
                # Logic: Explicitly calculate vacancy for the Filter Backend
                'has_vacancy': room.current_occupants < room.max_occupants,
                
                # Formatting: String for Display, Float for Range Filtering
                'rent_per_month': str(room.rent_per_month), 
                'rent_value': float(room.rent_per_month),
                
                'gender_preference': room.gender_preference,
                'is_active': room.is_active,
                'created_at': room.created_at,
                'updated_at': room.updated_at,
                
                # Uses your model property (Make sure Agent is prefetched!)
                'agent_fee': room.agent_fee, 
            })
            
        return rooms_data
