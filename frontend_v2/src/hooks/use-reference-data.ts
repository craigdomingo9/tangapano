import fetchAmenities from "@/lib/api/fetchAmenities";
import fetchCampuses from "@/lib/api/fetchCampuses";
import { useQuery } from "@tanstack/react-query";

// 1. Hook for Amenities
export function useAmenities() {
  return useQuery({
    // We include the params in the key so caching is accurate
    queryKey: ["amenities", { has_listings: true }],
    queryFn: () => fetchAmenities({ params: { has_listings: true } }),
    // Optimization: Don't refetch specific amenities for 1 hour
    // unless explicitly invalidated.
    staleTime: 1000 * 60 * 60,
  });
}

// 2. Hook for Campuses
export function useCampuses() {
  return useQuery({
    queryKey: ["campuses", { has_listings: true }],
    queryFn: () => fetchCampuses({ params: { has_listings: true } }),
    staleTime: 1000 * 60 * 60,
  });
}
