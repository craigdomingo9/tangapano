"use client";
import Header from "../Header";
import { Briefcase } from "lucide-react";
import useListings from "@/hooks/useListings";
import ResultsNavigation from "./ResultsNavigation";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import ResultsGrid from "./ResultsGrid";
import LoadMoreButton from "./LoadMoreButton";
import EndOfResults from "./states/EndOfResults";
import EmptyState from "./states/EmptyState";
import useStudentFilters from "@/lib/stores/studentFilterStore";

interface SearchResultsProps {
  queryString: string;
}

function SearchResultsClient({ queryString }: SearchResultsProps) {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListings(queryString);
  const { reset } = useStudentFilters();

  const router = useRouter();

  // Fixed: Properly flatten paginated results
  const results = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page) => page.results || []);
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pages?.[0]?.count || results.length;
  }, [data, results.length]);

  function onExpressInterest(listingId: string) {
    router.push(`/student?expressInterest=true&listing=${listingId}`);
  }

  function onAdjustFilters() {
    router.push("/student");
  }

  function onClearSearch() {
    reset();
    router.push("/student");
  }

  return (
    <div>
      <Header sticky variant="student" className="bg-crimson">
        <div className="flex gap-2">
          <button className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Partner Login</span>
          </button>
        </div>
      </Header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <ResultsNavigation />

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {isError && <ErrorState />}

        {/* Results Found */}
        {isSuccess && results.length > 0 && (
          <>
            <ResultsGrid
              results={results}
              onExpressInterest={onExpressInterest}
            />

            {/* Load More Button */}
            {hasNextPage && (
              <LoadMoreButton
                isLoading={isFetchingNextPage}
                onClick={fetchNextPage}
              />
            )}

            {/* End of results indicator - Only show when no more pages */}
            {!hasNextPage && (
              <EndOfResults
                totalCount={totalCount}
                onAdjustFilters={onAdjustFilters}
              />
            )}
          </>
        )}

        {/* No Results Found - Empty State */}
        {isSuccess && results.length === 0 && (
          <EmptyState
            onClearSearch={onClearSearch}
            onAdjustFilters={onAdjustFilters}
          />
        )}
      </main>
    </div>
  );
}

export default SearchResultsClient;
