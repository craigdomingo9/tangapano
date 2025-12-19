declare global {
    interface Amenity {
        id: string;
        name: string;
        display_name: string;
        category: AmenityCategory;
    }

    interface AmenityCategory {
        id: string;
        name: string;
        display_name: string;
        amenities?: Amenity[];
    }
}

export { };
