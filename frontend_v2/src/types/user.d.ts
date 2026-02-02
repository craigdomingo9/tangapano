declare global {
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
    employee_profile: Employee;
  }

  interface Permission {
    id: number;
    name: string;
    codename: PermissionCodename;
    content_type: number;
  }

  interface Department {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  }

  interface Role {
    id: number;
    name: string;
    description: string | null;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
  }

  interface Employee {
    id: number;
    user: User;
    department: Department | null;
    role: Role | null;
    date_hired: string | null;
    phone_number: string | null;
    address: string | null;
  }

  type PermissionCodename =
    | "view_user"
    | "add_user"
    | "change_user"
    | "delete_user"
    | "view_department"
    | "add_department"
    | "change_department"
    | "delete_department"
    | "view_employee"
    | "add_employee"
    | "change_employee"
    | "delete_employee"
    | "view_role"
    | "add_role"
    | "change_role"
    | "delete_role"
    | "view_landlord"
    | "add_landlord"
    | "change_landlord"
    | "delete_landlord"
    | "view_agent"
    | "add_agent"
    | "change_agent"
    | "delete_agent"
    | "view_listingstat"
    | "add_listingstat"
    | "change_listingstat"
    | "delete_listingstat"
    | "view_listingviewevent"
    | "add_listingviewevent"
    | "change_listingviewevent"
    | "delete_listingviewevent"
    | "view_usersession"
    | "add_usersession"
    | "change_usersession"
    | "delete_usersession"
    | "view_subscription"
    | "add_subscription"
    | "change_subscription"
    | "delete_subscription"
    | "view_tier"
    | "add_tier"
    | "change_tier"
    | "delete_tier"
    | "view_campus"
    | "add_campus"
    | "change_campus"
    | "delete_campus"
    | "view_city"
    | "add_city"
    | "change_city"
    | "delete_city"
    | "view_neighborhood"
    | "add_neighborhood"
    | "change_neighborhood"
    | "delete_neighborhood"
    | "view_interest"
    | "add_interest"
    | "change_interest"
    | "delete_interest"
    | "view_listing"
    | "add_listing"
    | "change_listing"
    | "delete_listing"
    | "view_room"
    | "add_room"
    | "change_room"
    | "delete_room"
    | "view_amenity"
    | "add_amenity"
    | "change_amenity"
    | "delete_amenity"
    | "view_category"
    | "add_category"
    | "change_category"
    | "delete_category"
    | "view_listingimage"
    | "add_listingimage"
    | "change_listingimage"
    | "delete_listingimage"
    | "view_listinglocation"
    | "add_listinglocation"
    | "change_listinglocation"
    | "delete_listinglocation"
    | "view_notification"
    | "add_notification"
    | "change_notification"
    | "delete_notification";

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
    username?: string;
    company_name: string;
    phone_number: string;
    full_name: string;
    address: string;
    is_verified: boolean;
    current_tier: string;
    joined_at: string;
    account_type: "individual" | "agency";
  }
}

export {};
