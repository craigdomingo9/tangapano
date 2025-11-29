"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createRouterStore } from "./store";
import { appRoutes } from "./routes";
import { AppParams } from "./types";

// Initialize store
const useRouterStore = createRouterStore<AppParams>();

// Animation Constants (Fixed Type Error)
const variants = {
  initial: { opacity: 0, y: 5 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -5 },
};

const transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2,
} as const; // <--- FIX: "as const" satisfies the literal type requirement

export function RouteRenderer() {
  const searchParams = useSearchParams();
  const { activeRoute, resolve } = useRouterStore();

  // 1. Convert URL Params to Object
  const currentParams = useMemo(() => {
    const obj: any = {};
    searchParams.forEach((value, key) => (obj[key] = value));
    return obj as AppParams;
  }, [searchParams]);

  // 2. Resolve Route
  useEffect(() => {
    resolve(currentParams, appRoutes);
  }, [currentParams, resolve]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {activeRoute ? (
          <motion.div
            key={activeRoute.id}
            initial="initial"
            animate="in"
            exit="out"
            variants={variants}
            transition={transition}
            className="w-full"
          >
            <activeRoute.component params={currentParams} />
          </motion.div>
        ) : (
          <div className="p-4 text-gray-500">404: No View Found</div>
        )}
      </AnimatePresence>
    </div>
  );
}
