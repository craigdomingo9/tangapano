import { cn } from "@/lib/utils";
import Header from "../Header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouterPush } from "@/hooks/use-router-push";
import { StudentParams } from "@/lib/types/student";
import { ChevronLeft } from "lucide-react";

function ListingDetailHeader() {
  const { push } = useRouterPush<StudentParams>();

  return (
    <Header
      variant="student"
      sticky
      className={cn(
        // Added "absolute" or "fixed" might be needed depending on your layout,
        // but 'sticky' usually works if inside the scroll flow.
        "top-0 w-full z-50 transition-all duration-300 bg-crimson dark:bg-app-header"
      )}
      containerClassName="py-4"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => push({ page: "home" })}
          className={cn(
            "text-white hover:text-slate-200 hover:bg-lapis/30 dark:hover:bg-slate-800 rounded-full px-4"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    </Header>
  );
}

export default ListingDetailHeader;
