import { allUniversityProgrammes } from "@/lib/constants/universityProgrammes";
import {
  ExpressInterestState,
  useExpressInterestStore,
} from "@/lib/stores/expressInterestStore";
import { cn } from "@/lib/utils";
import { ChevronRight, GraduationCap } from "lucide-react";

interface AcademicInformationProps {
  updateStore: (key: keyof ExpressInterestState, value: any) => void;
}

function AcademicInformation({ updateStore }: AcademicInformationProps) {
  const {
    entities: { program, yearOfStudy, confirmed },
  } = useExpressInterestStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
          <GraduationCap
            className="text-indigo-600 dark:text-indigo-400"
            size={24}
          />
        </div>
        <h3 className="font-bold text-slate-900 text-lg dark:text-white">
          Final Step: Academic Details
        </h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xsm font-semibold text-slate-700 mb-2 dark:text-slate-200">
            7. Program of Study
          </label>
          <div className="relative">
            <select
              value={program}
              onChange={(e) => updateStore("program", e.target.value)}
              className="w-full mt-2 text-sm px-4 py-3.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700  focus:border-lapis focus:ring-1 focus:ring-lapis dark:focus:ring-blue-400 outline-none text-slate-900 dark:text-white appearance-none bg-slate-50/30 dark:bg-app-input font-medium cursor-pointer"
            >
              <option value="" disabled>
                Select program...
              </option>
              {allUniversityProgrammes.map((p, idx) => (
                <option key={p + idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xsm font-semibold text-slate-700 mb-2 dark:text-slate-200">
            8. Year of Study
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2 text-xsm sm:text-sm">
            {["1st Year", "2nd Year", "3rd Year", "4th Year+"].map((y) => (
              <button
                key={y}
                onClick={() => updateStore("yearOfStudy", y)}
                className={cn(
                  "py-2 px-1.5 cursor-pointer rounded-lg border font-semibold transition-all text-center",
                  yearOfStudy === y
                    ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-100 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-transparent hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicInformation;
