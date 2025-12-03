"use client";

import { useEffect, useMemo, Suspense } from "react";
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
  const { endNavigation } = useNavigationStore(); // Ensure push is destructured
  const queryClient = useQueryClient();

  // 1. Derive Params (Sync)
  const currentParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as P;
  }, [searchParams.toString()]);

  // 2. Find Route (Sync)
  // We do not need state here. This happens instantly.
  const activeRoute = routes.find((r) => r.matcher(currentParams));

  // 3. Detect "Root" State (e.g. tangapano.co.zw/)
  // This is the specific scenario where we want to show a Loader instead of a 404
  const isRootPath = Object.keys(currentParams).length === 0;

  useEffect(() => {
    endNavigation();
    queryClient.invalidateQueries();

    // Auto-redirect root to home
    if (isRootPath) {
      // Use your store's push, or fallback to window if store isn't ready
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("page", "home");
      window.history.replaceState(null, "", newUrl.toString());
      // Force a reload if your router doesn't pick up manual history changes automatically
      // But ideally, use: push({ page: 'home' } as any);
    }
  }, [currentParams, activeRoute, endNavigation, isRootPath]);

  // 4. "Resolving" UI
  // If we are at the root path, we are technically "resolving" a redirect.
  // Show the loader here to prevent the "404 Flash".
  if (isRootPath) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-50/50 dark:bg-slate-950 isolate">
      <AnimatePresence mode="wait">
        {activeRoute ? (
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
          <motion.div
            key="404"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorPage type="404" />
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
