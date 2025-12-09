"use client";

import { AppRoute } from "@/routing/types";
import { lazyLoad } from "@/routing/utils";
import { AdminPanelContext, AdminPanelParams } from "@/lib/types/admin";

const Login = lazyLoad(() => import("@/components/admin/pages/Login"));
const Dashboard = lazyLoad(() => import("@/components/admin/pages/Dashboard"));
const Analytics = lazyLoad(() => import("@/components/admin/pages/Analytics"));
const ListingManagement = lazyLoad(
  () => import("@/components/admin/pages/ListingManagement")
);
const ListingDetail = lazyLoad(
  () => import("@/components/admin/pages/ListingDetail")
);
const LandlordManagement = lazyLoad(
  () => import("@/components/admin/pages/LandlordManagement")
);
const LandlordDetail = lazyLoad(
  () => import("@/components/admin/pages/LandlordDetail")
);
const AgentManagement = lazyLoad(
  () => import("@/components/admin/pages/AgentManagement")
);
const Locations = lazyLoad(
  () => import("@/components/admin/pages/LocationsAmenities")
);
const Notifications = lazyLoad(
  () => import("@/components/admin/pages/Notifications")
);

export const adminPanelRoutes: AppRoute<AdminPanelParams, AdminPanelContext>[] =
  [
    {
      id: "login",
      matcher: (p) => p.page === "login",
      component: Login,
    },

    {
      id: "analytics",
      matcher: (p) => p.page === "analytics",
      component: Analytics,
    },

    {
      id: "landlord-detail",
      matcher: (p) => p.page === "landlords" && !!p.landlordId,
      component: LandlordDetail,
    },

    {
      id: "landlord-management",
      matcher: (p) => p.page === "landlords" && !p.landlordId,
      component: LandlordManagement,
    },

    {
      id: "agent-management",
      matcher: (p) => p.page === "agents",
      component: AgentManagement,
    },

    {
      id: "locations",
      matcher: (p) => p.page === "locations",
      component: Locations,
    },

    {
      id: "notifications",
      matcher: (p) => p.page === "notifications",
      component: Notifications,
    },

    {
      id: "listing-management",
      matcher: (p) => p.page === "listings" && !p.listingId,
      component: ListingManagement,
    },

    {
      id: "listing-detail",
      matcher: (p) => p.page === "listings" && !!p.listingId,
      component: ListingDetail,
    },

    {
      id: "dashboard",
      matcher: (p) => p.page === "dashboard" || !p.page,
      component: Dashboard,
    },
  ];
