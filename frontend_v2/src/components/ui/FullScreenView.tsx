import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "./button";

interface FullScreenViewProps {
  title: string;
  onBack: () => void;
  children?: React.ReactNode;
  action?: React.ReactNode;
}

export function FullScreenView({
  title,
  onBack,
  children,
  action,
}: FullScreenViewProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col animate-in fade-in slide-in-from-bottom-4 transition-colors duration-300">
      {/* Standardized Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex-none sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 px-2 sm:px-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

            <h2 className="font-semibold text-slate-800 dark:text-slate-200 truncate text-sm sm:text-base flex-1 min-w-0">
              {title}
            </h2>
          </div>

          <div className="shrink-0">{action}</div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20">{children}</div>
      </div>
    </div>
  );
}
