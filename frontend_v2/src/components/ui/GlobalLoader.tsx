"use client";

import { useNavigationStore } from "@/lib/stores/navigationStore";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalLoader() {
  const { isNavigating } = useNavigationStore();

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-100 h-1 bg-slate-100 dark:bg-slate-800"
        >
          {/* The Moving Bar */}
          <motion.div
            className="h-full bg-lapis dark:bg-sky-500 shadow-[0_0_10px_#0EA5E9]"
            initial={{ width: "0%" }}
            animate={{
              width: "90%",
              transition: { duration: 2, ease: "circOut" }, // Slows down as it reaches 90%
            }}
            exit={{
              width: "100%",
              transition: { duration: 0.2 }, // Zips to finish on complete
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
