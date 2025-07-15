from django.db.models import Q, Count, Subquery


def filter_amenities(request, queryset):
    amenities = request.query_params.get('amenity', '')
    amenity_names = [a.strip() for a in amenities.split(',') if a.strip()]
    
    # Filter by amenity
    if amenity_names:
        q_objects = Q()
        for name in amenity_names:
            q_objects |= Q(amenities__amenity__name__iexact=name)
        
        min_match_count = len(amenity_names) - 1
        queryset = queryset.annotate(
            match_count=Count('amenities', filter=q_objects)
        ).filter(match_count__gte=min_match_count).distinct()
    
    return queryset

def filter_price_range(request, queryset):
    min_price = request.query_params.get('price_min', '')
    max_price = request.query_params.get('price_max', '')
    
    # Filter by price range
    if min_price:
        queryset = queryset.filter(rooms__rent_per_month__gte=min_price)
    if max_price:
        queryset = queryset.filter(rooms__rent_per_month__lte=max_price)

    return queryset

def filter_max_occupancy(request, queryset):
    max_occupancy = request.query_params.get('max_occupants', '')
    
    # Filter by max occupancy
    if max_occupancy:
        queryset = queryset.filter(rooms__max_occupancy__lte=max_occupancy)

    return queryset

def filter_gender(request, queryset):
    gender = request.query_params.get('gender', '')
    
    # Filter by gender
    if gender != 'any' or gender != '':
        queryset = queryset.filter(rooms__gender_preference__iexact=gender)

    return queryset

def filter_campus_and_neighborhood(request, queryset):
    campus = request.query_params.get('campus', '')
    neighborhood = request.query_params.get('neighborhood', '')
    
    # Filter by campus and neighborhood
    print(queryset[0].campus.id, "<--", campus)
    if campus:
        queryset = queryset.filter(
            Q(campus__in=[campus]) & Q(neighborhood__in=[neighborhood])
        )
    # if neighborhood:
    #     queryset = queryset.filter(neighborhood=neighborhood)
    

    return queryset