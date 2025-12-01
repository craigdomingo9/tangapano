import { create } from "zustand";
import { AppRoute, BaseParams } from "./types";

interface RouterStore<P extends BaseParams, C> {
  activeRoute: AppRoute<P, C> | null;
  // The resolver takes current params and a LIST of possible routes
  resolve: (params: P, routes: AppRoute<P, C>[]) => void;
}

// We create a factory to ensure types are respected,
// but for simplicity, a single store instance usually suffices if cleared.
// However, to keep it simple and type-safe, we cast the creation:
export const createRouterStore = <P extends BaseParams, C>() =>
  create<RouterStore<P, C>>((set) => ({
    activeRoute: null,
    resolve: (params, routes) => {
      // Find the first route where matcher(params) returns true
      const match = routes.find((r) => r.matcher(params));
      set({ activeRoute: match || null });
    },
  }));
