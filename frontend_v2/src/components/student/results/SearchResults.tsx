import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/api/get-query-client";
import { hashString } from "@/lib/utils";
import { fetchListings } from "@/lib/api/listings";
import SearchResultsClient from "./SearchResultsClient";

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function SearchResults({ searchParams }: SearchResultsProps) {
  const queryClient = getQueryClient();

  const params = new URLSearchParams(searchParams as Record<string, string>);
  const queryString = params.toString();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["listings", hashString(queryString)],
    queryFn: ({ pageParam }) => fetchListings({ pageParam, queryString }),
    initialPageParam: 1, // Required for infinite queries
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchResultsClient queryString={queryString} />
    </HydrationBoundary>
  );
}

export default SearchResults;
