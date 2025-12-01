import useListings from "@/hooks/useListings";
import { StudentComponentProps, StudentParams } from "@/lib/types/student";
import Header from "../Header";
import { Briefcase } from "lucide-react";
import { useMemo } from "react";
import ResultsNavigation from "../results/ResultsNavigation";
import LoadingState from "../results/states/LoadingState";
import ErrorState from "../results/states/ErrorState";
import ResultsGrid from "../results/ResultsGrid";
import LoadMoreButton from "../results/LoadMoreButton";
import EndOfResults from "../results/states/EndOfResults";
import EmptyState from "../results/states/EmptyState";
import { useRouterPush } from "@/hooks/use-router-push";
import useStudentFilters from "@/lib/stores/studentFilterStore";

function SearchResults({ params, serverData }: StudentComponentProps) {
  // Remove page from params
  delete params.page;

  const newParams = new URLSearchParams(params as Record<string, string>);
  const queryString = newParams.toString();

  // Hooks
  const { push } = useRouterPush<StudentParams>();
  const { reset } = useStudentFilters();

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListings(queryString);
  // console.log(data);

  const results = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page) => page.results || []);
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pages?.[0]?.count || results.length;
  }, [data, results.length]);

  function onExpressInterest(listingId: string) {
    push({ page: "interest", listingId: listingId });
  }

  function onAdjustFilters() {
    push({ page: "home" });
  }

  function onClearSearch() {
    reset();
    push({ page: "home" });
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

export default SearchResults;
