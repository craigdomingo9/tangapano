"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createRouterStore } from "./store";
import { AppRoute, BaseParams } from "./types";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import { useNavigationStore } from "@/lib/stores/navigationStore";

const useRouterStore = createRouterStore<any, any>();

// 1. DEFINE SAFE VARIANTS (Opacity Only)
const fadeVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

interface Props<P extends BaseParams, C> {
  serverData: C;
  routes: AppRoute<P, C>[];
}

export function RouteRenderer<P extends BaseParams, C>({
  serverData,
  routes,
}: Props<P, C>) {
  const searchParams = useSearchParams();
  const { activeRoute, resolve } = useRouterStore();
  const [isResolving, setIsResolving] = useState(true);
  const { endNavigation } = useNavigationStore();

  const currentParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as P;
  }, [searchParams]);

  useEffect(() => {
    if (routes) {
      resolve(currentParams, routes);
      setIsResolving(false);

      // / STOP THE LOADER
      // The URL has changed, and we have resolved the new component.
      endNavigation();
    }
  }, [currentParams, resolve, routes]);

  return (
    // 2. USE MIN-H-SCREEN
    // Ensures the container always fills the viewport height without collapsing
    <div className="relative w-full min-h-screen bg-gray-50/50 dark:bg-slate-950">
      <AnimatePresence mode="wait">
        {isResolving ? (
          <motion.div key="loader" exit={{ opacity: 0 }}>
            <LoadingScreen />
          </motion.div>
        ) : activeRoute ? (
          <motion.div
            key={activeRoute.id}
            variants={fadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            // 3. WILL-CHANGE: OPACITY
            // Hints the browser to optimize this layer without breaking layout
            style={{ willChange: "opacity" }}
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
