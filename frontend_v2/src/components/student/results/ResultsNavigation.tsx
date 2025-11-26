"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function ResultsNavigation() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/student")}
      className="mb-8 flex items-center gap-4"
    >
      <Button
        variant="ghost"
        className="text-slate-500 hover:text-crimson dark:text-slate-400 dark:hover:text-red-400 hover:bg-crimson/5 dark:hover:bg-red-900/10 -ml-2"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to filters
      </Button>
    </div>
  );
}

export default ResultsNavigation;
