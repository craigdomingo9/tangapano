"use client";

import { useEffect, useMemo, Suspense, useState, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { AppRoute, BaseParams } from "./types";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage"; // Check path
import { useNavigationStore } from "@/lib/stores/navigationStore"; // Check path
import { useQueryClient } from "@tanstack/react-query";

const minimalistVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8, // Very small movement (8px)
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut", // Smooth deceleration
    },
  },
  exit: {
    opacity: 0,
    y: -4, // Slight lift on exit
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};
interface Props<P extends BaseParams, C> {
  serverData: C;
  routes: AppRoute<P, C>[];
}

// Internal Component: Handles the Logic inside Suspense
function RouterContent<P extends BaseParams, C>({
  serverData,
  routes,
}: Props<P, C>) {
  const searchParams = useSearchParams();
  const { endNavigation } = useNavigationStore();
  const queryClient = useQueryClient();

  // 1. Calculate Params
  const currentParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as P;
  }, [searchParams.toString()]);

  // 2. Find Route (Sync)
  const activeRoute = routes.find((r) => r.matcher(currentParams));

  // --- NEW LOGIC START ---
  // State to gate the 404 page
  const [shouldShowError, setShouldShowError] = useState(false);

  useEffect(() => {
    // A. Always clear navigation state on param change
    endNavigation();
    queryClient.invalidateQueries();

    // B. Handle the 404 Timer
    let timeoutId: NodeJS.Timeout;

    if (activeRoute) {
      // If we found a route, ensure error state is reset immediately
      setShouldShowError(false);
    } else {
      // If NO route matches, wait 5 seconds before admitting defeat (showing 404)
      setShouldShowError(false); // Start with loading
      timeoutId = setTimeout(() => {
        setShouldShowError(true);
      }, 5000);
    }

    // Cleanup: Clear timer if params change or component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentParams, activeRoute, endNavigation, queryClient]);
  // --- NEW LOGIC END ---

  return (
    // 4. LAYOUT WRAPPER (Min-H-Screen)
    <div className="relative w-full min-h-screen bg-gray-50/50 dark:bg-slate-950 isolate">
      <AnimatePresence mode="wait">
        {activeRoute ? (
          // CASE 1: ROUTE FOUND
          <motion.div
            key={activeRoute.id} // Changing key triggers animation
            variants={minimalistVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ willChange: "opacity, transform" }}
            // 5. PERFORMANCE HINT
            className="w-full"
          >
            <ScrollTrigger />
            <activeRoute.component
              params={currentParams}
              serverData={serverData}
            />
          </motion.div>
        ) : (
          // CASE 2: NO ROUTE (Yet)
          <motion.div
            key={shouldShowError ? "404-error" : "404-loading"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {shouldShowError ? (
              // Timer finished, truly 404
              <ErrorPage type="404" />
            ) : (
              // Timer running, waiting...
              <LoadingScreen />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 6. MAIN EXPORT (Suspense Wrapper)
// This ensures useSearchParams works correctly
export function RouteRenderer<P extends BaseParams, C>(props: Props<P, C>) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterContent {...props} />
    </Suspense>
  );
}

function ScrollTrigger() {
  useLayoutEffect(() => {
    // 1. Try to find the scrolling container
    const scrollContainer = document.getElementById("main-content");

    // 2. Define the scroll logic
    const handleScroll = () => {
      // If container exists, scroll IT. If not, fallback to window.
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    // 3. Fire immediately
    handleScroll();

    // 4. Fire again on next frame (double-tap safety)
    requestAnimationFrame(handleScroll);
  }, []); // Runs on every mount (every route change)

  return null;
}
