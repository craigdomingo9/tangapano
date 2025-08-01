'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';


const MyQueryClient = new QueryClient({/* ... */});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import("@tanstack/query-core").QueryClient;
  }
}


export function Providers({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    // This code is for all users
    window.__TANSTACK_QUERY_CLIENT__ = MyQueryClient;
  }, [])

  return (
    <QueryClientProvider client={MyQueryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
