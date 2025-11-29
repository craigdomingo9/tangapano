import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { Route, when } from "./store";
import dynamic from "next/dynamic";
import { AppParams, RouteProps } from "./types";

const Overview = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/Overview"),
  {
    loading: () => <LoadingScreen />,
  }
);

const RoomManagement = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/RoomManagement"),
  {
    loading: () => <LoadingScreen />,
  }
);

const ImageManagement = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/ImageManagement"),
  {
    loading: () => <LoadingScreen />,
  }
);

const ProfileManagement = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/ProfileManagement"),
  {
    loading: () => <LoadingScreen />,
  }
);

const AmenitiesManagement = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/AmenitiesManagement"),
  {
    loading: () => <LoadingScreen />,
  }
);

const ListingManagement = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/ListingManagement"),
  {
    loading: () => <LoadingScreen />,
  }
);

const Support = dynamic<RouteProps>(
  () => import("@/components/partner/dashboard/pages/Support"),
  {
    loading: () => <LoadingScreen />,
  }
);

// 2. The Configuration
// Order matters! Top routes are checked first.
export const appRoutes: Route<AppParams>[] = [
  // Priority 1: Specific User Profile
  // Matches: ?page=users&userId=123
  {
    id: "overview",
    matcher: (p) => p.page === "overview" || when.empty(p),
    component: Overview,
  },

  // Priority 2: Settings page
  // Matches: ?page=settings
  {
    id: "rooms",
    matcher: when.params({ page: "rooms" }),
    component: RoomManagement,
  },

  // Priority 3: Dashboard (Fallback)
  // Matches: ?page=dashboard OR empty URL
  {
    id: "images",
    matcher: (p) => p.page === "images" || when.empty(p),
    component: ImageManagement,
  },

  // Priority 4: Dashboard (Fallback)
  // Matches: ?page=dashboard OR empty URL
  {
    id: "profile",
    matcher: (p) => p.page === "profile",
    component: ProfileManagement,
  },

  // Priority 4: Dashboard (Fallback)
  // Matches: ?page=dashboard OR empty URL
  {
    id: "amenities",
    matcher: (p) => p.page === "amenities",
    component: AmenitiesManagement,
  },

  // Priority 4: Dashboard (Fallback)
  // Matches: ?page=dashboard OR empty URL
  {
    id: "listings",
    matcher: (p) => p.page === "listings",
    component: ListingManagement,
  },
  {
    id: "support",
    matcher: (p) => p.page === "support",
    component: Support,
  },
];
