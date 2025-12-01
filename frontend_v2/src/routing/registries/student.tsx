"use client";

import { AppRoute } from "@/routing/types";
import { StudentParams, StudentContext } from "@/lib/types/student";
import { lazyLoad } from "@/routing/utils";

// --- Lazy Load Pages ---
// Replace paths with your actual component locations
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
  // Matches: ?page=interest&listingId=123
  {
    id: "express-interest",
    matcher: (p) => p.page === "interest" && !!p.listingId,
    component: ExpressInterest,
  },

  // 2. LISTING DETAIL PAGE (Marketing / Sharing)
  // Matches: ?page=listing&listingId=123
  {
    id: "listing-detail",
    matcher: (p) => p.page === "listing" && !!p.listingId,
    component: ListingDetail,
  },

  // 3. SEARCH RESULTS PAGE
  // Matches: ?page=search (plus any filter params like campus=2)
  {
    id: "search-results",
    matcher: (p) => p.page === "search",
    component: SearchResults,
  },

  // 4. MAIN PAGE (Home / Filter Selection)
  // Matches: Root url OR ?page=home
  {
    id: "student-home",
    matcher: (p) => !p.page || p.page === "home",
    component: StudentHome,
  },
];
