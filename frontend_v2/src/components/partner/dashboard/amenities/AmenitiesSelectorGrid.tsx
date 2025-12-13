import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import useAmenityCategoriesPartner from "@/hooks/partner/use-amenity-categories";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ErrorPage } from "../overview/ErrorPage";

interface AmenitiesSelectorGridProps {
  selectedIds: (string | number)[];
  onChange: (ids: (string | number)[]) => void;
}

export default function AmenitiesSelectorGrid({
  selectedIds = [],
  onChange,
}: AmenitiesSelectorGridProps) {
  const {
    amenityCategories,
    amenityCategoriesIsLoading,
    amenityCategoriesIsError,
  } = useAmenityCategoriesPartner();

  // 2. Handle toggling logic
  const toggleAmenity = (id: string | number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (amenityCategoriesIsLoading) return <LoadingScreen />;
  if (amenityCategoriesIsError) return <ErrorPage type="500" />;
  if (!amenityCategories?.length) {
    return <div className="text-slate-500 italic">No amenities available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      {/* Iterate over CONFIG to ensure specific display order */}
      {amenityCategories?.map((category) => {
        return (
          <div
            key={category.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xsm uppercase tracking-wide">
                {category.name}
              </h3>
            </div>

            {/* Amenities List */}
            <div className="p-5 flex flex-wrap gap-2.5">
              {category?.amenities?.map((amenity) => {
                const isSelected = selectedIds.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button" // Prevent form submission if inside a form
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg cursor-pointer text-xs font-semibold transition-all duration-200 border flex items-center gap-2 active:scale-95 select-none",
                      isSelected
                        ? "bg-lapis dark:bg-sky-600 text-white dark:border-sky-600 shadow-sm"
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
