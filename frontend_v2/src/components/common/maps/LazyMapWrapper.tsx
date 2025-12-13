// components/map/LazyMapWrapper.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamic Import with SSR disabled (Crucial for Leaflet)
const ListingMap = dynamic(() => import("./ListingMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface LazyMapProps {
  listing: Listing;
  isFullScreen?: boolean;
}

export const LazyMapWrapper: React.FC<LazyMapProps> = ({
  listing,
  isFullScreen,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer: Trigger load when map is 200px away from viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0",
        isFullScreen && "h-[90vh]"
      )}
    >
      {isVisible ? <ListingMap listing={listing} /> : <MapSkeleton />}
    </div>
  );
};

const MapSkeleton = () => (
  <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center animate-pulse gap-3">
    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
    <span className="text-sm font-medium text-slate-400">Loading Map...</span>
  </div>
);
