export interface AdminPanelContext {
  user: User;
  accessToken: string;
}

export interface AdminPanelParams {
  page?: string;
  [key: string]: string | undefined;
}

// 3. The Component Props (The Helper Type)
// Use THIS type in your components like ImageManagement
export interface AdminPanelComponentProps {
  params: AdminPanelParams;
  serverData: AdminPanelContext;
}
