"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createRouterStore } from "./store";
import { appRoutes } from "./routes";
import { AppParams, RouteProps } from "./types";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen"; // Adjust path
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";

// Initialize store
const useRouterStore = createRouterStore<AppParams>();

interface Props {
  userContext: ServerContext;
}

export function RouteRenderer({ userContext }: Props) {
  const searchParams = useSearchParams();
  const { activeRoute, resolve } = useRouterStore();

  // 1. ADD STATE: Track if we have finished the initial route check
  const [isResolving, setIsResolving] = useState(true);

  const currentParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as AppParams;
  }, [searchParams]);

  useEffect(() => {
    // 2. Resolve the route
    resolve(currentParams, appRoutes);

    // 3. Mark resolution as complete immediately after
    setIsResolving(false);
  }, [currentParams, resolve]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {/* CASE 1: Still figuring out where to go */}
        {isResolving ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <LoadingScreen />
          </motion.div>
        ) : activeRoute ? (
          /* CASE 2: Route Found */
          <motion.div
            key={activeRoute.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <activeRoute.component
              params={currentParams}
              serverData={userContext}
            />
          </motion.div>
        ) : (
          /* CASE 3: Route Not Found (404) */
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
