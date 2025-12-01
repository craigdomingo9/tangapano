import dynamic from "next/dynamic";
import { ComponentType } from "react";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";

// Make sure you import User from where you defined it!
import { Route, when } from "./store";
import { AppParams, RouteProps } from "./types";

/* -------------------------------------------------------------------------- */
/* Dynamic Imports Helper                            */
/* -------------------------------------------------------------------------- */

// Simplification: We know ALL pages must accept RouteProps.
// We don't need this to be generic anymore.
const withLoader = (importer: () => Promise<any>) =>
  dynamic<RouteProps>(importer, {
    loading: () => <LoadingScreen />,
  });

/* -------------------------------------------------------------------------- */
/* Page Definitions                             */
/* -------------------------------------------------------------------------- */

export const pages = {
  overview: withLoader(
    () => import("@/components/partner/dashboard/pages/Overview")
  ),
  rooms: withLoader(
    () => import("@/components/partner/dashboard/pages/RoomManagement")
  ),
  images: withLoader(
    () => import("@/components/partner/dashboard/pages/ImageManagement")
  ),
  profile: withLoader(
    () => import("@/components/partner/dashboard/pages/ProfileManagement")
  ),
  amenities: withLoader(
    () => import("@/components/partner/dashboard/pages/AmenitiesManagement")
  ),
  listings: withLoader(
    () => import("@/components/partner/dashboard/pages/ListingManagement")
  ),
  support: withLoader(
    () => import("@/components/partner/dashboard/pages/Support")
  ),
};

/* -------------------------------------------------------------------------- */
/* Route Builder                               */
/* -------------------------------------------------------------------------- */

// FIX: This helper must enforce that 'component' accepts RouteProps
const route = (
  id: string,
  matcher: (params: AppParams) => boolean,
  component: ComponentType<RouteProps> // <--- CRITICAL FIX
): Route<AppParams, User> => ({
  id,
  matcher,
  component,
});

/* -------------------------------------------------------------------------- */
/* Application Routes                             */
/* -------------------------------------------------------------------------- */

export const appRoutes: Route<AppParams, User>[] = [
  route(
    "overview",
    (p) => p.page === "overview" || when.empty(p),
    pages.overview
  ),

  route("rooms", when.params({ page: "rooms" }), pages.rooms),

  route("images", (p) => p.page === "images", pages.images),

  route("profile", (p) => p.page === "profile", pages.profile),

  route("amenities", (p) => p.page === "amenities", pages.amenities),

  route("listings", (p) => p.page === "listings", pages.listings),

  route("support", (p) => p.page === "support", pages.support),
];
