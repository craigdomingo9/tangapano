interface Campus {
  id: string;
  name: string;
  city: City;
  address: string;
  neighborhoods: Neighborhood[];
  agent: Agent;
}

interface City {
  id: string;
  name: string;
  campuses: Campus[];
}

interface Neighborhood {
  id: string;
  name: string;
  city: City;
  has_listings: string;
}

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
  id: number;
  user: User | number;
  company_name: string;
  phone_number: string;
  full_name: string;
  address: string;
  is_verified: boolean;
  current_tier: string;
  joined_at: string;
  account_type: "individual" | "agency";
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

interface Location {
  lon: number;
  lat: number;
}

interface Interest {
  room: any;
  contacted_agent?: string;
  full_name: string;
  student_id: string;
  phone_number: string;
  year_of_study: string;
  program: string;
  move_in_timeline: "immediately" | "2_weeks" | "1_month" | "next_semester";
  deposit_readiness: "ready_now" | "within_24h" | "need_time";
  payment_method: "cash" | "mobile" | "bank_transfer";
  agree_to_terms: boolean;
}

interface Inquiry {
  id: string;
  move_in_timeline: {
    key: "immediately" | "2_weeks" | "1_month" | "next_semester";
    value:
      | "Immediately (within 1 week)"
      | "Within 2 weeks"
      | "Within 1 month"
      | "Next Semester";
  };
  deposit_readiness: {
    key: "ready_now" | "within_24h" | "need_time";
    value:
      | "Yes, ready to pay deposit"
      | "Will arrange within 24 hours"
      | "Need more time to arrange funds";
  };
  payment_method: {
    key: "cash" | "mobile" | "bank_transfer";
    value: "Cash" | "Mobile Payment" | "Bank Transfer";
  };
  agree_to_terms: boolean;
  listing: Partial<Listing>;
  room: Partial<Room>;
  full_name: string;
  student_id: string;
  phone_number: string;
  year_of_study: string;
  program: string;
  timestamp: string;
  contacted_agent: Agent;
}

// This is the shape of the data passed from page.tsx
interface ServerContext {
  user: User;
  accessToken: string; // Needed for client-side fetching!
  // Add other globals here later:
  // notificationsCount?: number;
  // theme?: 'light' | 'dark';
}

interface Notification {
  id: string;
  recipient: User;
  readonly title: string;
  readonly message: string;
  readonly notification_type: "info" | "success" | "warning" | "error";
  readonly category: "billing" | "listing" | "inquiry" | "system";
  readonly action_link: string;
  readonly is_read: boolean;
  readonly created_at: string;
}
