import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAmenities } from "@/hooks/use-reference-data";
import useStudentFilters, {
  StudentFilters,
} from "@/lib/stores/studentFilterStore";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface AmenitiesFilterProps {
  updateFilter: (
    key: keyof StudentFilters,
    value: string | number | null | string[]
  ) => void;
}

function AmenitiesFilter({ updateFilter }: AmenitiesFilterProps) {
  const { data, isLoading, isError, isSuccess } = useAmenities();
  const amenities: Amenity[] = data || [];

  const {
    entities: { selectedPerks },
  } = useStudentFilters();
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  function togglePerk(perk: string) {
    const isSelected = selectedPerks.includes(perk);
    const updatedPerks = isSelected
      ? selectedPerks.filter((p) => p !== perk)
      : [...selectedPerks, perk];
    updateFilter("selectedPerks", updatedPerks);
  }

  return (
    <div className="space-y-4">
      <Label className="text-[0.75rem] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
        <Star className="w-4 h-4 text-crimson dark:text-red-400" />
        Amenities & Perks{" "}
        {isLoading && (
          <div className="w-5 h-5 animate-spin rounded-full border-b-2 border-crimson border-t-transparent"></div>
        )}
      </Label>
      <div className="flex flex-wrap gap-2.5">
        {isSuccess &&
          amenities.slice(0, showAllAmenities ? undefined : 12).map((perk) => {
            const isSelected = selectedPerks.includes(perk.name);
            return (
              <Badge
                key={perk.id}
                // variant={isSelected ? "brand" : "outline"}
                className={cn(
                  "px-[0.9rem] py-[0.4rem] rounded-full text-[0.75rem] font-medium transition-all duration-200 cursor-pointer select-none border",
                  isSelected
                    ? "bg-lapis border-lapis text-white shadow-md transform scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                )}
                onClick={() => togglePerk(perk.name)}
              >
                {perk.display_name}
              </Badge>
            );
          })}
        {isSuccess && amenities.length > 12 && (
          <Badge
            variant="outline"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="px-4 py-2 rounded-full text-[0.75rem] font-semibold text-slate-500 dark:text-slate-400 border-dashed border-slate-300 dark:border-slate-600 hover:border-lapis hover:text-lapis dark:hover:text-sky-400 transition-all cursor-pointer bg-transparent"
          >
            {showAllAmenities ? "Show Less" : "+ More"}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default AmenitiesFilter;
