export interface AppParams {
  page?: string;
  mode?: "view" | "edit" | "create";
}

// This is the standard signature for ALL your route components
export interface RouteProps {
  params: AppParams;
  serverData: ServerContext;
}
