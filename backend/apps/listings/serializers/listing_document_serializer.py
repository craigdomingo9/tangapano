from rest_framework import serializers
from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from listings.documents import ListingDocument


# 1. Create a Custom List Serializer
class ListingListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        # 1. Get the standard list of dictionaries
        results = super().to_representation(data)
        
        cleaned_results = []

        for item in results:
            # --- Filter Logic: Check Rooms ---
            # Ensure rooms exist and the list is not empty
            rooms = item.get('rooms')
            if not rooms or len(rooms) == 0:
                continue # Skip this listing entirely

            # --- Sensitive Data Logic: Hide Phone Number ---
            # We modify the 'item' dictionary directly before adding it to our final list
            if item.get('landlord'):
                # Pop removes the key safely (returns None if key doesn't exist)
                item['landlord'].pop('phone_number', None)
                item['landlord'].pop('address', None)

            # Add the processed item to the new list
            cleaned_results.append(item)
        
        return cleaned_results
    

class ListingDocumentSerializer(DocumentSerializer):
    # Passthrough fields (The Document has already formatted them as JSON)
    landlord = serializers.DictField()
    campus = serializers.DictField()
    neighborhood = serializers.DictField()
    images = serializers.ListField(child=serializers.DictField())
    amenities = serializers.ListField(child=serializers.DictField())
    rooms = serializers.SerializerMethodField()

    class Meta:
        document = ListingDocument
        # This tells DRF: "When serializing a list (many=True), use this class"
        list_serializer_class = ListingListSerializer
        fields = (
            'id',
            'landlord',
            'title',
            'description',
            'images',
            'amenities',
            'campus',
            'neighborhood',
            'apply_agent_fee',
            'is_locked',
            'distance_from_campus',
            'is_active',
            'rooms',
            'created_at',
            'updated_at'
        )
    
    def get_rooms(self, obj):
        """
        Manually filter rooms based on the Query Params.
        If we don't do this, ES returns ALL rooms for a matched listing.
        """
        all_rooms = []
        if hasattr(obj, 'rooms'):
            all_rooms = obj.rooms

        # 1. Get Query Params from the View Context
        request = self.context.get('request')
        params = request.query_params if request else {}

        filtered_rooms = []

        for r in all_rooms:
            # --- Filter: Vacancy (Default to showing only available rooms?) ---
            # If is_full=false (or default logic), exclude full rooms
            # Adjust logic: If user explicitly wants full rooms, show them. 
            # Otherwise, hide full rooms.
            if params.get('is_full') == 'false' or not params.get('is_full'):
                if not r.has_vacancy:
                    continue

            # --- Filter: Price Min ---
            if params.get('price_min'):
                try:
                    if r.rent_value < float(params['price_min']):
                        continue
                except (ValueError, TypeError):
                    pass # Ignore invalid params

            # --- Filter: Price Max ---
            if params.get('price_max'):
                try:
                    if r.rent_value > float(params['price_max']):
                        continue
                except (ValueError, TypeError):
                    pass

            # --- Filter: Gender ---
            req_gender = params.get('gender')
            if params.get('gender'):
                r_gender = r.gender_preference.lower()
                q_gender = req_gender.lower()

                # RELAXED LOGIC: 
                # Valid if exact match OR if room is simply 'any'
                is_match = (r_gender == q_gender) or (r_gender == 'any')
                
                if not is_match:
                    continue
            
            # --- Filter: Max Occupants ---
            if params.get('max_occupants'):
                try:
                    if r.max_occupants != int(params['max_occupants']):
                        continue
                except (ValueError, TypeError):
                    pass

            # If it survived all checks, add to output
            filtered_rooms.append({
                'id': r.id,
                'rent_value': r.rent_value,
                'is_full': r.is_full,
                'rent_per_month': r.rent_display,
                'max_occupants': r.max_occupants,
                'gender_preference': r.gender_preference,
                'current_occupants': r.current_occupants,
                'has_vacancy': r.has_vacancy,
            })

        return filtered_rooms
