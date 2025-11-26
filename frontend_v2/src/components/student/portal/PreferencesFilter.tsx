import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useStudentFilters, {
  StudentFilters,
} from "@/lib/stores/studentFilterStore";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface PreferencesFilterProps {
  updateFilter: (
    key: keyof StudentFilters,
    value: string | number | null
  ) => void;
}

function PreferencesFilter({ updateFilter }: PreferencesFilterProps) {
  const {
    entities: { roommates, gender },
  } = useStudentFilters();
  const studentsPerRoom = roommates || 1;
  const roomGender = gender || "Female";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
          Roommates (Including You)
        </Label>
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateFilter("roommates", Math.max(1, studentsPerRoom - 1))
            }
            disabled={studentsPerRoom === 1}
            className="w-10 h-10 rounded-lg bg-white hover:cursor-pointer dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 shadow-sm hover:text-lapis hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="flex-1 text-center font-bold text-slate-900 dark:text-white">
            {studentsPerRoom}{" "}
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Person(s)
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateFilter("roommates", Math.min(5, studentsPerRoom + 1))
            }
            disabled={studentsPerRoom === 5}
            className="w-10 h-10 rounded-lg bg-white hover:cursor-pointer dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 shadow-sm hover:text-lapis hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
          Gender
        </Label>
        <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl flex border border-slate-200 dark:border-slate-700">
          {["Male", "Female"].map((g) => (
            <button
              key={g}
              onClick={() => updateFilter("gender", g.toLowerCase())}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold rounded-lg transition-all hover:cursor-pointer",
                roomGender === g.toLowerCase()
                  ? "bg-white dark:bg-slate-600 text-lapis dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreferencesFilter;
