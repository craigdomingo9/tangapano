"use client";

import { useEffect, useMemo, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { AppRoute, BaseParams } from "./types";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import { useNavigationStore } from "@/lib/stores/navigationStore";
import { useQueryClient } from "@tanstack/react-query";

const minimalistVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

interface Props<P extends BaseParams, C> {
  serverData: C;
  routes: AppRoute<P, C>[];
}

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
    <div className="relative w-full min-h-screen bg-gray-50/50 dark:bg-slate-950 isolate">
      <AnimatePresence mode="wait">
        {activeRoute ? (
          // CASE 1: ROUTE FOUND
          <motion.div
            key={activeRoute.id}
            variants={minimalistVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full"
            style={{ willChange: "opacity, transform" }}
          >
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
            exit={{ opacity: 0 }}
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

export function RouteRenderer<P extends BaseParams, C>(props: Props<P, C>) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterContent {...props} />
    </Suspense>
  );
}
