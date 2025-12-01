"use client";
import { Button } from "@/components/ui/button";
import { RouterLink } from "@/routing/RouterLink";
import { ChevronLeft } from "lucide-react";

function ResultsNavigation() {
  return (
    <div className="mb-8 flex items-center gap-4">
      <RouterLink to={{ page: "home" }}>
        <Button
          variant="ghost"
          className="text-slate-500 bg-slate-200/80 dark:bg-app-input text-sm hover:text-crimson dark:text-slate-400 dark:hover:text-red-400 hover:bg-crimson/5 dark:hover:bg-red-900/10 -ml-2 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to filters
        </Button>
      </RouterLink>
    </div>
  );
}

export default ResultsNavigation;
