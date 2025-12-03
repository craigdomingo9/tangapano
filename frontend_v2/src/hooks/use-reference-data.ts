import fetchAmenities from "@/lib/api/fetchAmenities";
import fetchCampuses from "@/lib/api/fetchCampuses";
import { fetchListingById } from "@/lib/api/listings";
import { useQuery } from "@tanstack/react-query";

// 1. Hook for Amenities
export function useAmenities({
  has_listings = true,
}: {
  has_listings?: boolean;
} = {}) {
  // <--- FIX: Added " = {}" here to allow calling without args
  return useQuery({
    queryKey: ["amenities", { has_listings }],
    queryFn: () => fetchAmenities({ params: { has_listings } }),
    staleTime: 1000 * 60 * 60,
  });
}

// 2. Hook for Campuses
export function useCampuses({
  has_listings = true,
}: {
  has_listings?: boolean;
} = {}) {
  // <--- FIX: Added " = {}" here to allow calling without args
  return useQuery({
    queryKey: ["campuses_cache", { has_listings }],
    queryFn: () => fetchCampuses({ params: { has_listings } }),
    staleTime: 1000 * 60 * 60,
  });
}
export function useListingDetail(listingId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["listing-detail_cache", listingId],
    queryFn: () => fetchListingById(listingId),
    enabled: !!listingId && enabled,
    staleTime: 1000 * 60 * 2,
  });
}
