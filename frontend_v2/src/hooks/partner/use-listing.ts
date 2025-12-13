import { fetchListingDetailPartner } from "@/lib/api/partner/listings";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function useListingsPartner(accessToken: string, listingId?: string) {
  const { data: listing, isLoading: listingIsLoading } = useQuery({
    queryKey: ["landlord-listing"],
    queryFn: () => fetchListingDetailPartner(accessToken, listingId!!),
  });
  return { listing, listingIsLoading };
}

export default useListingsPartner;
