import { Label } from "@/components/ui/label";
import { useCampuses } from "@/hooks/use-reference-data";
import useStudentFilters, {
  StudentFilters,
} from "@/lib/stores/studentFilterStore";
import { ChevronRight, GraduationCap, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LocationFiltersProps = {
  updateFilter: (
    key: keyof StudentFilters,
    value: string | number | null | string[]
  ) => void;
};

function LocationFilters({ updateFilter }: LocationFiltersProps) {
  const { data, isSuccess, isLoading, isError } = useCampuses();
  const campuses: Campus[] = data || [];

  const {
    entities: { campus, neighborhood },
  } = useStudentFilters();

  const neighborhoods = useMemo(() => {
    if (!campus || campuses.length === 0) return [];

    const match = campuses.find((c) => String(c.id) === String(campus));

    return match?.neighborhoods ?? [];
  }, [campus, isSuccess]);

  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;

    updateFilter("campus", newId);
  };

  useEffect(() => {
    // We are clearing the neighborhood when the campus changes
    updateFilter("neighborhood", "");
  }, [campus]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-crimson dark:text-red-400" />
          Campus
        </Label>
        <div className="relative group">
          <select
            value={campus ?? ""}
            onChange={handleCampusChange}
            className="w-full text-[0.95rem] font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl py-3.5 px-4 pr-10 appearance-none outline-none focus:ring-2 focus:ring-lapis/50 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
            disabled={isLoading || isError}
          >
            <option value="" disabled>
              Select Campus
            </option>
            {isSuccess &&
              campuses.map((c: Campus) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            {isLoading && (
              <div className="w-5 h-5 animate-spin rounded-full border-b-2 border-crimson border-t-transparent"></div>
            )}
            {isSuccess && <ChevronRight className="w-5 h-5 rotate-90" />}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
          <MapPin className="w-4 h-4 text-crimson dark:text-red-400" />
          Area
        </Label>
        <div className="relative group">
          <select
            value={neighborhood || ""}
            onChange={(e) => updateFilter("neighborhood", e.target.value)}
            className="w-full font-bold text-[0.95rem] bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl py-3.5 px-4 pr-10 appearance-none outline-none focus:ring-2 focus:ring-lapis/50 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
            disabled={!campus || isLoading || isError}
          >
            <option value="+">Any Neighborhood</option>
            {neighborhoods &&
              neighborhoods?.map((n: Neighborhood) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            {isLoading && (
              <div className="w-5 h-5 animate-spin rounded-full border-b-2 border-crimson border-t-transparent"></div>
            )}
            {neighborhoods && neighborhoods?.length > 0 && (
              <ChevronRight className="w-5 h-5 rotate-90" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationFilters;
