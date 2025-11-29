import { create } from "zustand";
import { ComponentType } from "react";

// --- Types ---
export interface Route<TParams, TServerData = any> {
  id: string;
  matcher: (params: TParams) => boolean;
  component: ComponentType<{ params: TParams; serverData: TServerData }>;
}

interface RouterState<TParams> {
  activeRoute: Route<TParams> | null;
  resolve: (params: TParams, routes: Route<TParams>[]) => void;
}

// --- Store ---
export const createRouterStore = <TParams>() =>
  create<RouterState<TParams>>((set, get) => ({
    activeRoute: null,

    resolve: (params, routes) => {
      // 1. Find the first matching route
      const match = routes.find((route) => route.matcher(params)) || null;

      // 2. Performance Check (Bug Fix):
      // Only trigger a state update if the Route ID actually changed.
      // This prevents unnecessary re-renders when non-routing params change.
      const currentId = get().activeRoute?.id;
      const newId = match?.id;

      if (currentId !== newId) {
        set({ activeRoute: match });
      }
    },
  }));

// --- Helper Matchers ---
export const when = {
  // Matches if the URL params strictly contain these key/values
  params:
    <T>(shape: Partial<T>) =>
    (params: T) => {
      return Object.entries(shape).every(([key, value]) => {
        // @ts-ignore - Dynamic access is safe here
        return params[key] === value;
      });
    },

  // Matches if the URL params are essentially empty
  empty: (params: any) => {
    return (
      Object.keys(params).length === 0 ||
      Object.values(params).every((v) => v === undefined || v === "")
    );
  },
};
