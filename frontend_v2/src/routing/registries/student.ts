"use client";

import { AppRoute } from "@/routing/types";
import { StudentParams, StudentContext } from "@/lib/types/student";
import { lazyLoad } from "@/routing/utils";

const StudentHome = lazyLoad(
  () => import("@/components/student/pages/StudentHome")
);
const SearchResults = lazyLoad(
  () => import("@/components/student/pages/SearchResults")
);
const ListingDetail = lazyLoad(
  () => import("@/components/student/pages/ListingDetail")
);
const ExpressInterest = lazyLoad(
  () => import("@/components/student/pages/ExpressInterest")
);

export const studentRoutes: AppRoute<StudentParams, StudentContext>[] = [
  // 1. EXPRESS INTEREST PAGE
  {
    id: "express-interest",
    // FIX: Remove '&& !!p.listingId'. If page is 'interest', GO THERE.
    matcher: (p) => p.page === "interest",
    component: ExpressInterest,
  },

  // 2. LISTING DETAIL PAGE
  {
    id: "listing-detail",
    // FIX: Remove '&& !!p.listingId'. Let the component handle 404s.
    matcher: (p) => p.page === "listing",
    component: ListingDetail,
  },

  // 3. SEARCH RESULTS PAGE
  {
    id: "search-results",
    matcher: (p) => p.page === "search",
    component: SearchResults,
  },

  // 4. MAIN PAGE (Home)
  {
    id: "student-home",
    matcher: (p) => !p.page || p.page === "home",
    component: StudentHome,
  },
];
