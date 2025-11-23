interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  neighborhoods: Neighborhood[];
  agent: Agent;
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
  has_listings: string;
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
  landlord_profile: Landlord;
  agent_profile: Agent;
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
  display_image: string;
  caption: string;
  is_face_image: boolean;
}

interface Room {
  id: string;
  room_number: number;
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

type Listing = {
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
  created_at: string;
  updated_at: string;
};
