


interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  neighborhoods: Neighborhood[];
  agents: Agent;
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

interface Amenity {
  id: string;
  name: string;
  display_name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface Agent {
  id: string;
  user: User;
  agency_name: string;
  agent_fee: string;
  phone_number: string;
  address: string;
}

interface Landlord {
  user: User;
  company_name: string;
  phone_number: string;
  address: string;
}

interface Image {
  id: string;
  image: string;
  caption: string;
}

interface Room {
  id: string;
  listing: number;
  max_occupants: number;
  rent_per_month: string;
  gender_preference: string;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ListingAmenity {
  id: string;
  listing: number;
  amenity: Amenity;
}

interface Listing {
  id: string;
  title: string;
  landlord: Landlord;
  description: string;
  images: Image[];
  amenities: ListingAmenity[];
  campus: Campus;
  neighborhood: Neighborhood;
  distance_from_campus: string;
  rooms: Room[];
  is_active: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}


