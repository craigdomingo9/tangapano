"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { BaseParams } from "@/routing/types";
import { useNavigationStore } from "@/lib/stores/navigationStore";

export function useRouterPush<T extends BaseParams>() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { startNavigation } = useNavigationStore(); // <--- Get Action

  const push = useCallback(
    (to: T, options?: { preserveParams?: boolean; scroll?: boolean }) => {
      const { preserveParams = false, scroll = true } = options || {};

      const newParams = new URLSearchParams(
        preserveParams ? searchParams.toString() : ""
      );

      Object.entries(to).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // 1. Start the Global Loader
      startNavigation();

      // 2. Start the Transition
      startTransition(() => {
        router.push(`?${newParams.toString()}`, { scroll });
      });
    },
    [router, searchParams, startNavigation]
  );

  return { push, isPending };
}
