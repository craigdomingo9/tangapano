import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface EndOfResultsProps {
  totalCount: number;
  onAdjustFilters: () => void;
}

function EndOfResults({ totalCount, onAdjustFilters }: EndOfResultsProps) {
  return (
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
        You've viewed all {/* {totalCount} */}
        {totalCount === 1 ? "property" : "properties"} matching your search. Try
        adjusting your filters or search area to find more options.
      </p>

      <div className="mt-6">
        <Button
          onClick={onAdjustFilters}
          variant="outline"
          className="rounded-full px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-lapis dark:hover:text-sky-400 hover:border-lapis/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm bg-transparent cursor-pointer"
        >
          Adjust Filters
        </Button>
      </div>
    </div>
  );
}

export default EndOfResults;
