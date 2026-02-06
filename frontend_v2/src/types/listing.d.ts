declare global {
  interface Listing {
    id: string;
    title: string;
    landlord: Landlord;
    description: string;
    images: Image[];
    amenities: Amenity[];
    campus: Campus;
    neighborhood: Neighborhood;
    distance_from_campus: string;
    rooms: Room[];
    apply_agent_fee: boolean;
    is_locked: boolean;
    is_active: boolean;
    is_available: boolean;
    location?: Location;
    campus_location?: Location;
    created_at: string;
    updated_at: string;
  }

  interface Room {
    id: string;
    room_number: number;
    room_name: string | null;
    agent_fee: string;
    listing: number;
    max_occupants: number;
    current_occupants: number;
    rent_per_month: string;
    gender_preference: "any" | "male" | "female";
    is_full: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }

  interface Image {
    id: string;
    image: string;
    display_image: string;
    caption: string;
    is_face_image: boolean;
  }
}

export {};
