import { cn } from "@/lib/utils";
import Header from "../Header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouterPush } from "@/hooks/use-router-push";
import { StudentParams } from "@/lib/types/student";
import { ChevronLeft } from "lucide-react";

// CONFIG: Match this ID to the div in your Layout that has 'overflow-y-auto'
const SCROLL_CONTAINER_ID = "main-scroll-container";

function ListingDetailHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { push } = useRouterPush<StudentParams>();

  useEffect(() => {
    // 1. Target the actual scrollable element, fallback to window if not found
    const scrollContainer =
      document.getElementById(SCROLL_CONTAINER_ID) || window;

    const handleScroll = () => {
      // 2. Normalize reading the scroll position
      const scrollTop =
        scrollContainer instanceof Window
          ? scrollContainer.scrollY
          : scrollContainer.scrollTop;

      setIsScrolled(scrollTop > 50);
    };

    // 3. Attach listener to the container, not always window
    scrollContainer.addEventListener("scroll", handleScroll);

    // 4. Initial check in case we mount already scrolled
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

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
