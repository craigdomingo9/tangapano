// Keep this simple.
// If you notice lag on HOVER, remove the .preload() call from RouterLink
// and only let it load on click.
import dynamic from "next/dynamic";
import { ComponentType } from "react";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";

export function lazyLoad<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  // Simple, robust dynamic import
  return dynamic(importFn, {
    loading: () => <LoadingScreen />,
    ssr: false, // Keep this false for dashboard views to avoid hydration mismatches
  });
}
