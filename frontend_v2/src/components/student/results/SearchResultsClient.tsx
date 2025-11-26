"use client";
import Header from "../Header";
import { Briefcase, Home, Search } from "lucide-react";
import useListings from "@/hooks/useListings";
import ResultsNavigation from "./ResultsNavigation";
import { StudentListingCardSkeleton } from "./StudentListingCardSkeleton";
import { Button } from "@/components/ui/button";
import { StudentListingCard } from "./StudentListingCard";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  queryString: string;
}

function SearchResultsClient({ queryString }: SearchResultsProps) {
  const {
    data,
    isLoading,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListings(queryString);
  console.log(data);
  const router = useRouter();
  const results: Listing[] = data?.results as any | [];

  function onExpressInterest() {
    router.push("/express");
  }

  function onAdjustFilters() {
    router.push("/student");
  }

  function onClearSearch() {
    router.push("/student");
  }

  return (
    <div>
      <Header
        sticky
        variant="student"
        className="bg-crimson"
        logoLinkRoute="/student"
      >
        <div className="flex gap-2">
          <button className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Partner Login</span>
          </button>
        </div>
      </Header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ResultsNavigation />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in duration-500">
            {[1, 2, 3, 4].map((i) => (
              <StudentListingCardSkeleton key={i} />
            ))}
          </div>
        ) : // Results Grid or Empty State
        results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {results.map((listing) => (
                <StudentListingCard
                  key={listing.id}
                  listing={listing}
                  onExpressInterest={onExpressInterest}
                />
              ))}
            </div>

            {/* End of results indicator */}
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <div className="relative group">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 z-10 relative group-hover:scale-105 transition-transform duration-300">
                  <Search className="w-7 h-7 text-slate-300 dark:text-slate-500 group-hover:text-lapis dark:group-hover:text-sky-400 transition-colors" />
                </div>
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full scale-125 -z-10 opacity-50"></div>
              </div>

              <h3 className="text-slate-900 dark:text-slate-200 font-bold text-lg mt-6">
                No more accommodations
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                You've viewed all {results.length} properties matching your
                search. Try adjusting your filters or search area to find more
                options.
              </p>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-lapis dark:hover:text-sky-400 hover:border-lapis/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm bg-transparent"
                >
                  Adjust Filters
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center shadow-lg border border-slate-100 dark:border-slate-800 mb-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8 group cursor-default">
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center relative z-10 ring-8 ring-slate-50 dark:ring-slate-800/50">
                <Home className="w-14 h-14 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-slate-400 dark:group-hover:text-slate-500" />
              </div>
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-lapis/5 dark:bg-sky-500/10 rounded-full animate-ping opacity-75 duration-[2s]"></div>
              <div className="absolute top-0 right-0 -mr-4 -mt-2 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 rotate-12 animate-[bounce_3s_infinite]">
                <Search className="w-6 h-6 text-lapis dark:text-sky-400" />
              </div>
              <div className="absolute bottom-2 left-0 -ml-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 -rotate-12">
                <span className="text-xl">🤔</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              No accommodations found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-base sm:text-lg leading-relaxed mb-10 mx-auto">
              We couldn't find any properties matching your specific criteria.
              Try expanding your search area or adjusting your budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <Button
                onClick={onAdjustFilters}
                size="lg"
                className="flex-1 bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-xl shadow-lapis/20 dark:shadow-sky-500/20 font-bold h-14 rounded-xl text-base"
              >
                Adjust Filters
              </Button>
              <Button
                onClick={onClearSearch}
                variant="outline"
                size="lg"
                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 h-14 rounded-xl bg-white dark:bg-slate-900 text-base"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Load More Button */}
      {/* <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading more..." : "Load More"}
      </button> */}
    </div>
  );
}

export default SearchResultsClient;
