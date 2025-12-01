export interface PartnerContext {
  user: User;
  accessToken: string;
}

export interface PartnerParams {
  page?: string;
  listingId?: string;
  mode?: "create" | "edit" | "view";
  [key: string]: string | undefined;
}

// 3. The Component Props (The Helper Type)
// Use THIS type in your components like ImageManagement
export interface PartnerComponentProps {
  params: PartnerParams;
  serverData: PartnerContext;
}
