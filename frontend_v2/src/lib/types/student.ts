// 1. The Server Context (Data fetched in page.tsx)
export interface StudentContext {
  user: User | null; // Nullable if students can search without logging in
  accessToken?: string;
}

// 2. The URL Parameters
export interface StudentParams {
  // Navigation
  page?: "listing" | "search" | "interest" | "home";
  listingId?: string; // For Detail & Express Interest

  // Search Filters (Matches your query string)
  campus?: string;
  neighborhood?: string;
  max_occupants?: string;
  gender?: "male" | "female" | string;
  price_min?: string;
  price_max?: string;
  amenities?: string;

  // Express Interest (Matches your query string)
  step?: string;

  // Index signature for generic access
  [key: string]: string | undefined;
}

// 3. The Component Props (Use this in your Pages)
export interface StudentComponentProps {
  params: StudentParams;
  serverData: StudentContext;
}
