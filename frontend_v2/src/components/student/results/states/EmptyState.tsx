import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

interface EmptyStateProps {
  onAdjustFilters: () => void;
  onClearSearch: () => void;
}

function EmptyState({ onAdjustFilters, onClearSearch }: EmptyStateProps) {
  return (
    <div className="w-full min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center shadow-lg border border-slate-100 dark:border-slate-800 mb-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-8 group cursor-default">
        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center relative z-10 ring-8 ring-slate-50 dark:ring-slate-800/50">
          <Home className="w-14 h-14 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-slate-400 dark:group-hover:text-slate-500" />
        </div>
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-lapis/5 dark:bg-sky-500/10 rounded-full animate-ping opacity-75 duration-[2s]"></div>
        <div className="absolute top-0 right-0 z-20 -mr-4 -mt-2 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 rotate-12 animate-[bounce_3s_infinite]">
          <Search className="w-6 h-6 text-lapis dark:text-sky-400" />
        </div>
        <div className="absolute bottom-2 z-20 left-0 -ml-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 -rotate-12">
          <span className="text-xl">🤔</span>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
        No accommodations found
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-xsm sm:text-sm leading-relaxed mb-10 mx-auto">
        We couldn't find any properties matching your specific criteria. Try
        expanding your search area or adjusting your budget.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
        <Button
          onClick={onAdjustFilters}
          size="lg"
          className="flex-1 bg-lapis hover:bg-lapis-hover py-4 sm:py-0 dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-xl shadow-lapis/20 dark:shadow-sky-500/20 font-bold h-14 rounded-xl text-sm cursor-pointer"
        >
          Adjust Filters
        </Button>
        <Button
          onClick={onClearSearch}
          variant="outline"
          size="lg"
          className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 h-14 py-4 sm:py-0 rounded-xl bg-white dark:bg-slate-900 text-sm cursor-pointer"
        >
          Clear Search
        </Button>
      </div>
    </div>
  );
}

export default EmptyState;
