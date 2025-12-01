import { ComponentType } from "react";

// 1. The minimal shape of URL search params
export interface BaseParams {
  [key: string]: string | undefined;
}

// 2. The Generic Route Definition
// P = The shape of the URL Params (e.g. { page: string, listingId?: string })
// C = The Server Data Context (e.g. { user: User, accessToken: string })
export interface AppRoute<P extends BaseParams, C> {
  id: string;
  // Function to decide if this route is active
  matcher: (params: P) => boolean;
  // The Component to render if matched
  component: ComponentType<{ params: P; serverData: C }>;
}
