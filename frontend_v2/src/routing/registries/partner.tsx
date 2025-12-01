import dynamic from "next/dynamic";
import { AppRoute, BaseParams } from "@/routing/types";
import { PartnerContext, PartnerParams } from "@/lib/types/partner";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { lazyLoad } from "../utils";

// Lazy Load Components
const Overview = lazyLoad(
  () => import("@/components/partner/dashboard/pages/Overview")
);
const ListingManagement = lazyLoad(
  () => import("@/components/partner/dashboard/pages/ListingManagement")
);
const ProfileManagement = lazyLoad(
  () => import("@/components/partner/dashboard/pages/ProfileManagement")
);
const RoomManagement = lazyLoad(
  () => import("@/components/partner/dashboard/pages/RoomManagement")
);
const ImageManagement = lazyLoad(
  () => import("@/components/partner/dashboard/pages/ImageManagement")
);
const AmenitiesManagement = lazyLoad(
  () => import("@/components/partner/dashboard/pages/AmenitiesManagement")
);
const Support = lazyLoad(
  () => import("@/components/partner/dashboard/pages/Support")
);

// THE REGISTRY
export const partnerRoutes: AppRoute<PartnerParams, PartnerContext>[] = [
  {
    id: "overview",
    matcher: (p) => !p.page || p.page === "overview",
    component: Overview,
  },
  {
    id: "listing-detail",
    // Matches if page is listings AND we have an ID or Edit Mode
    matcher: (p) =>
      p.page === "listings" && (!!p.listingId || p.mode === "create"),
    component: ListingManagement,
  },
  {
    id: "profile",
    matcher: (p) => p.page === "profile",
    component: ProfileManagement,
  },
  {
    id: "rooms",
    matcher: (p) => p.page === "rooms",
    component: RoomManagement,
  },
  {
    id: "images",
    matcher: (p) => p.page === "images",
    component: ImageManagement,
  },
  {
    id: "amenities",
    matcher: (p) => p.page === "amenities",
    component: AmenitiesManagement,
  },
  {
    id: "support",
    matcher: (p) => p.page === "support",
    component: Support,
  },
];
