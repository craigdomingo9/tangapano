"use client";

import { useEffect, useMemo, Suspense } from "react";
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

  // 2. DIRECT CALCULATION
  // We derive state immediately during render. No useEffect delay.
  const currentParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as P;
  }, [searchParams.toString()]);

  const activeRoute = routes.find((r) => r.matcher(currentParams));

  // 3. SIDE EFFECTS (Loader & Logging)
  useEffect(() => {
    // Stop the Global Loader whenever params change (Navigation finished)
    endNavigation();
    queryClient.invalidateQueries();

    // Debug Logs
    // console.log("%c ROUTER DEBUG ", "background: #222; color: #bada55");
    // console.log("URL Params:", currentParams);
    // console.log(
    //   "Matched Route ID:",
    //   activeRoute?.id || "NONE (Falling to 404)"
    // );
  }, [currentParams, activeRoute, endNavigation]);

  return (
    // 4. LAYOUT WRAPPER (Min-H-Screen)
    <div className="relative w-full min-h-screen bg-gray-50/50 dark:bg-slate-950 isolate">
      <AnimatePresence mode="wait">
        {activeRoute ? (
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
            <activeRoute.component
              params={currentParams}
              serverData={serverData}
            />
          </motion.div>
        ) : (
          <motion.div
            key="404"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ErrorPage type="404" />
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
