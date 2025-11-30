"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { AppParams } from "@/routing/types";

interface NavigateOptions {
  preserveParams?: boolean; // Default: false (clears other params)
  scroll?: boolean; // Default: true (scrolls to top)
}

export function useRouterPush() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to construct the query string (DRY logic from RouterLink)
  const getQueryString = useCallback(
    (to: AppParams, preserveParams: boolean) => {
      // 1. Start with existing params OR empty
      const newParams = new URLSearchParams(
        preserveParams ? searchParams.toString() : ""
      );

      // 2. Merge or Delete keys
      Object.entries(to).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      return "?" + newParams.toString();
    },
    [searchParams]
  );

  /**
   * Pushes a new route to the history stack
   */
  const push = useCallback(
    (to: AppParams, options: NavigateOptions = {}) => {
      const { preserveParams = false, scroll = true } = options;
      const href = getQueryString(to, preserveParams);
      router.push(href, { scroll });
    },
    [router, getQueryString]
  );

  /**
   * Replaces the current history entry (Back button won't go back here)
   */
  const replace = useCallback(
    (to: AppParams, options: NavigateOptions = {}) => {
      const { preserveParams = false, scroll = true } = options;
      const href = getQueryString(to, preserveParams);
      router.replace(href, { scroll });
    },
    [router, getQueryString]
  );

  return { push, replace };
}
