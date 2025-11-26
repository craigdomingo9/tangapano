"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { hashString } from "@/lib/utils";
import { fetchListings } from "@/lib/api/listings";

export default function useListings(params: string) {
  return useInfiniteQuery({
    queryKey: ["listings", hashString(params)],
    // Pass the params into the shared fetcher
    queryFn: ({ pageParam }) =>
      fetchListings({ pageParam, queryString: params }),

    staleTime: Infinity,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!allPages) return undefined;
      if (lastPage.next) {
        return allPages?.length + 1;
      }
      return undefined;
    },
  });
}
