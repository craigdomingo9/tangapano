import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/api/get-query-client";
import { fetchListingById } from "@/lib/api/listings";
import { redirect } from "next/navigation";
import ExpressInterestView from "./ExpressInterestView";

interface ExpressInterestProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ExpressInterest({
  searchParams,
}: ExpressInterestProps) {
  // 1. Safe ID Extraction
  // Next.js params can be arrays, so we ensure we get a single string
  const listingId = Array.isArray(searchParams.listing)
    ? searchParams.listing[0]
    : searchParams.listing;

  if (!listingId) {
    redirect("/portal?page=home"); // Redirect if no listing ID is provided
  }

  // 2. Initialize Query Client
  const queryClient = getQueryClient();

  // 3. Prefetch the Single Listing
  // This fetches data on the server and stores it in the cache
  await queryClient.prefetchQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetchListingById(listingId),
    staleTime: 1000 * 60 * 20,
  });

  return (
    <div className="container mx-auto max-w-2xl py-10">
      {/* 5. Hydrate the Cache */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Pass the ID so the client hook knows which key to look up */}
        <ExpressInterestView listingId={listingId} />
      </HydrationBoundary>
    </div>
  );
}
