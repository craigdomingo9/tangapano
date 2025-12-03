"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

const MyQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Set a reasonable staleTime (e.g., 1 minute)
      // This prevents "flickering" but ensures data isn't stale for too long
      staleTime: 60 * 1000,

      // 2. OPTIONAL: Garbage Collection Time (defaults to 5 mins)
      // How long unused data stays in memory
      gcTime: 1000 * 60 * 5,

      // 3. RETRY STRATEGY
      // Don't retry on 404s (not found) or 401s (unauthorized)
      retry: (failureCount, error: any) => {
        if (error.response?.status === 404) return false;
        if (error.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This code is for all users
    window.__TANSTACK_QUERY_CLIENT__ = MyQueryClient;
  }, []);

  return (
    <QueryClientProvider client={MyQueryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
