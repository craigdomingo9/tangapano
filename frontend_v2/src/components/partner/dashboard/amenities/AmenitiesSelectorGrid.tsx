import { cn } from "@/lib/utils";
import {
  BedDouble,
  Check,
  Gamepad2,
  ShieldCheck,
  Star,
  Sun,
  Users,
  Utensils,
  LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

// --- Types ---

export interface Amenity {
  id: string | number;
  name: string; // Internal name (e.g., 'wifi')
  display_name: string; // Readable name (e.g., 'WiFi')
  category: string; // Matches keys in CATEGORY_CONFIG
}

interface AmenitiesSelectorGridProps {
  /** List of all available amenities fetched from the backend */
  availableAmenities: Amenity[];
  /** Array of currently selected amenity IDs */
  selectedIds: (string | number)[];
  /** Callback function when selection changes */
  onChange: (ids: (string | number)[]) => void;
  /** Optional search string to filter amenities visibly */
  searchQuery?: string;
}

interface CategoryConfigItem {
  label: string;
  icon: LucideIcon;
  color: string;
}

// --- Configuration ---

/**
 * Configuration mapping backend category slugs to Frontend UI elements.
 * Keys must match the 'category' field in your Django model.
 */
const CATEGORY_CONFIG: Record<string, CategoryConfigItem> = {
  connectivity: {
    label: "Connectivity & Utilities",
    icon: Sun,
    color: "text-sky-500 dark:text-sky-400",
  },
  comfort: {
    label: "Room Comfort",
    icon: BedDouble,
    color: "text-blue-500 dark:text-blue-400",
  },
  kitchen: {
    label: "Kitchen & Laundry",
    icon: Utensils,
    color: "text-cyan-500 dark:text-cyan-400",
  },
  common: {
    label: "Common Areas",
    icon: Users,
    color: "text-indigo-500 dark:text-indigo-400",
  },
  recreation: {
    label: "Recreation",
    icon: Gamepad2, // Changed from Star to Gamepad for better context
    color: "text-violet-500 dark:text-violet-400",
  },
  security: {
    label: "Security & Access",
    icon: ShieldCheck,
    color: "text-teal-500 dark:text-teal-400",
  },
};

/**
 * A grid component for selecting amenities grouped by category.
 * Supports light/dark mode and search filtering.
 */
export default function AmenitiesSelectorGrid({
  availableAmenities = [],
  selectedIds = [],
  onChange,
  searchQuery = "",
}: AmenitiesSelectorGridProps) {
  // 1. Group amenities by category
  const groupedAmenities = useMemo(() => {
    const groups: Record<string, Amenity[]> = {};

    availableAmenities.forEach((item) => {
      // Fallback to 'common' if category is missing or invalid
      const cat = CATEGORY_CONFIG[item.category] ? item.category : "common";

      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    return groups;
  }, [availableAmenities]);

  // 2. Handle toggling logic
  const toggleAmenity = (id: string | number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (!availableAmenities.length) {
    return <div className="text-slate-500 italic">No amenities available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      {/* Iterate over CONFIG to ensure specific display order */}
      {Object.entries(CATEGORY_CONFIG).map(([slug, config]) => {
        const categoryItems = groupedAmenities[slug] || [];
        const Icon = config.icon;

        // Apply Search Filter
        const filteredItems = categoryItems.filter((item) =>
          item.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Don't render empty categories
        if (filteredItems.length === 0) return null;

        return (
          <div
            key={slug}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
              <Icon className={cn("w-4 h-4", config.color)} />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xsm uppercase tracking-wide">
                {config.label}
              </h3>
            </div>

            {/* Amenities List */}
            <div className="p-5 flex flex-wrap gap-2.5">
              {filteredItems.map((amenity) => {
                const isSelected = selectedIds.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button" // Prevent form submission if inside a form
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg cursor-pointer text-xs font-semibold transition-all duration-200 border flex items-center gap-2 active:scale-95 select-none",
                      isSelected
                        ? "bg-slate-800 dark:bg-sky-600 text-white border-slate-800 dark:border-sky-600 shadow-sm"
                        : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {/* Checkbox Circle UI */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                        isSelected
                          ? "border-white bg-white text-slate-800 dark:text-sky-600"
                          : "border-slate-300 dark:border-slate-600"
                      )}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    {amenity.display_name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
