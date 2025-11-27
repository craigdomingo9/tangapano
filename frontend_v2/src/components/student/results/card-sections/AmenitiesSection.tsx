"use client";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAmenities } from "@/hooks/use-reference-data";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface AmenitiesSectionProps {
  listingAmenities: Amenity[];
  isExpanded: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

interface AmenitiesCategorization {
  matched: Amenity[];
  missing: Amenity[];
  extra: Amenity[];
}

export function useAmenitiesCategorization(
  amenities: Amenity[],
  amenitiesMasterList?: Amenity[]
): AmenitiesCategorization {
  const searchParams = useSearchParams();

  return useMemo(() => {
    // Get searched amenity names from URL
    const searchedAmenities = (searchParams.get("amenities") || "")
      .split(",")
      .filter(Boolean)
      .map((name) => name.trim()); // Added trim for safety

    // If no search filters, everything is extra
    if (searchedAmenities.length === 0) {
      return {
        matched: [],
        missing: [],
        extra: amenities,
      };
    }

    // Convert to Set for O(1) lookup instead of O(n)
    const searchedSet = new Set(searchedAmenities);
    const amenityNamesSet = new Set(amenities.map((a) => a.name.toString()));

    // Matched: in listing AND in search
    const matched = amenities.filter((amenity) =>
      searchedSet.has(amenity.name.toString())
    );

    // Extra: in listing but NOT in search
    const extra = amenities.filter(
      (amenity) => !searchedSet.has(amenity.name.toString())
    );

    // Missing: in search but NOT in listing
    const missing = searchedAmenities
      .filter((searchedName) => !amenityNamesSet.has(searchedName))
      .map((name) => {
        const masterAmenity = amenitiesMasterList?.find(
          (a: Amenity) => a.name.toString() === name
        );

        return {
          id: `missing-${name}`,
          name,
          display_name:
            masterAmenity?.display_name ||
            name
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
        } as Amenity;
      });

    return { matched, missing, extra };
  }, [amenities, searchParams, amenitiesMasterList]);
}

export default function AmenitiesSection({
  listingAmenities,
  isExpanded,
  onToggle,
}: AmenitiesSectionProps) {
  const { data: amenitiesMasterList } = useAmenities();
  const { matched, missing, extra } = useAmenitiesCategorization(
    listingAmenities,
    amenitiesMasterList
  );

  // Early return AFTER hooks
  if (!listingAmenities || listingAmenities.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-[0.675rem] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
        Amenities
      </h4>

      <div
        className={cn(
          "relative transition-all duration-500 ease-in-out overflow-hidden",
          isExpanded ? "max-h-[500px]" : "max-h-[72px]"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {/* 1. MATCHED (Green/Emerald) - User wanted it, property has it */}
          {matched.map((amenity: Amenity) => (
            <Badge
              key={amenity.id}
              variant="secondary"
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border"
            >
              <Check className="w-3 h-3 mr-1" />
              {amenity.display_name}
            </Badge>
          ))}

          {/* 2. MISSING (Red/Rose) - User wanted it, property does NOT have it */}
          {missing.map((amenity: Amenity) => (
            <Badge
              key={amenity.id}
              variant="secondary"
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border decoration-rose-700/50"
            >
              <X className="w-3 h-3 mr-1" />
              {/* Optional: Add line-through to emphasize it's missing */}
              <span className="opacity-90">{amenity.display_name}</span>
            </Badge>
          ))}

          {/* 3. EXTRA (Blue/Sky) - User didn't ask, but property has it (Bonus) */}
          {extra.map((amenity: Amenity) => (
            <Badge
              key={amenity.id}
              variant="secondary"
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-800/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 border"
            >
              <Plus className="w-3 h-3 mr-1" />
              {amenity.display_name}
            </Badge>
          ))}
        </div>

        {/* Gradient Overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(e);
        }}
        className="text-xs font-bold text-lapis dark:text-sky-400 hover:text-lapis-hover dark:hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
      >
        {isExpanded ? "Show Less" : "Expand Amenities"}
        <ChevronRight
          className={cn(
            "w-3 h-3 transition-transform",
            isExpanded ? "-rotate-90" : "rotate-90"
          )}
        />
      </button>
    </div>
  );
}
