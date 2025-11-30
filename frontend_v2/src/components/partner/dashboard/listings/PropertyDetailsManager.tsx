import { useCampuses } from "@/hooks/use-reference-data";
import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FormState } from "../pages/ListingManagement";

interface PropertyDetailsManagerProps {
  title: string;
  subtitle: string;
  onCancel: () => void;
  // onChange signature matches the FormState structure
  onChange: (field: keyof FormState, value: any) => void;
  onSave: () => void;
  formState: FormState;
  isSaving: boolean;
}

function PropertyDetailsManager({
  title,
  subtitle,
  onCancel,
  onChange,
  onSave,
  formState,
  isSaving,
}: PropertyDetailsManagerProps) {
  const { data: campuses, isSuccess } = useCampuses();

  // 1. Calculate Available Neighborhoods based on CURRENT formState.campus
  const availableNeighborhoods = useMemo(() => {
    if (!isSuccess || !campuses) return [];
    if (!formState.campus) return [];

    // Ensure strict string comparison to avoid mismatched types (1 vs "1")
    const match = campuses.find(
      (c: any) => String(c.id) === String(formState.campus)
    );

    return match?.neighborhoods ?? [];
  }, [formState.campus, campuses, isSuccess]);

  // 2. THE FIX: Reactive Cleanup
  // Whenever the available neighborhoods change (because campus changed),
  // check if the current neighborhood is still valid.
  useEffect(() => {
    // Only run if we actually have a neighborhood selected
    if (formState.neighborhood && isSuccess) {
      const isValid = availableNeighborhoods.find(
        (n: any) => String(n.id) === String(formState.neighborhood)
      );

      // If the selected neighborhood is NOT in the new list, clear it.
      if (!isValid) {
        onChange("neighborhood", "");
      }
    }
    // We strictly depend on availableNeighborhoods changing
  }, [availableNeighborhoods, formState.neighborhood, isSuccess, onChange]);

  const handleCampusChange = (newCampusId: string) => {
    onChange("campus", newCampusId);
  };

  //   useEffect(() => {
  //     onChange("neighborhood", "");
  //   }, [formState.campus]);

  const handleDistanceChange = (delta: number) => {
    const newDist = Math.max(0, formState.distance_from_campus + delta);
    onChange("distance_from_campus", newDist);
  };

  return (
    <>
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xsm">
          {subtitle}
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xsm font-semibold text-slate-700 dark:text-slate-300 block">
            Property Title
          </label>
          <input
            type="text"
            value={formState.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:border-lapis dark:focus:border-sky-500 focus:ring-1 focus:ring-lapis dark:focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm"
            placeholder="e.g. The Garden Residence"
          />
        </div>

        {/* Campus */}
        <div className="space-y-2">
          <label className="text-xsm font-semibold text-slate-700 dark:text-slate-300 block">
            Nearest Campus
          </label>
          <div className="relative">
            <select
              value={formState.campus}
              onChange={(e) => handleCampusChange(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:border-lapis dark:focus:border-sky-500 focus:ring-1 focus:ring-lapis dark:focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white appearance-none cursor-pointer font-medium text-sm"
            >
              <option
                value=""
                disabled
                className="text-slate-400 dark:text-slate-600"
              >
                Select campus...
              </option>
              {campuses?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {/* Chevron Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Neighborhood */}
        <div className="space-y-2">
          <label className="text-xsm font-semibold text-slate-700 dark:text-slate-300 block">
            Neighborhood
          </label>
          <div className="relative">
            <select
              value={formState.neighborhood}
              onChange={(e) => onChange("neighborhood", e.target.value)}
              disabled={!formState.campus}
              className={cn(
                "w-full text-sm px-4 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:border-lapis dark:focus:border-sky-500 focus:ring-1 focus:ring-lapis dark:focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white appearance-none cursor-pointer font-medium",
                !formState.campus &&
                  "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900"
              )}
            >
              <option
                value=""
                disabled
                className="text-slate-400 dark:text-slate-600"
              >
                {formState.campus
                  ? "Select neighborhood..."
                  : "Select a campus first"}
              </option>
              {availableNeighborhoods.map((n: any) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
            {/* Chevron Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-2">
          <label className="text-xsm font-semibold text-slate-700 dark:text-slate-300 block">
            Distance from Campus
          </label>
          <div className="flex items-center h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-lapis dark:focus-within:ring-sky-500 focus-within:border-lapis dark:focus-within:border-sky-500">
            <button
              onClick={() => handleDistanceChange(-5)}
              className="h-full px-5 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <span className="text-base font-bold cursor-pointer">−</span>
            </button>
            <div className="flex-1 flex items-center justify-center gap-2">
              <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {formState.distance_from_campus}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                min
              </span>
            </div>
            <button
              onClick={() => handleDistanceChange(5)}
              className="h-full px-5 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <span className="text-base font-bold cursor-pointer">+</span>
            </button>
          </div>
        </div>

        {/* Agent Fee Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
          <div
            className="flex flex-col cursor-pointer"
            onClick={() =>
              onChange("apply_agent_fee", !formState.apply_agent_fee)
            }
          >
            <label className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer">
              Agent Fee Applicable
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Requires agent commission?
            </span>
          </div>
          <button
            onClick={() =>
              onChange("apply_agent_fee", !formState.apply_agent_fee)
            }
            className={cn(
              "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none",
              formState.apply_agent_fee
                ? "bg-lapis dark:bg-sky-600"
                : "bg-slate-300 dark:bg-slate-600"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ease-out shadow-sm",
                formState.apply_agent_fee ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-4 pt-6 justify-end border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-8 py-2.5 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-all shadow-sm hover:shadow-md flex items-center justify-center min-w-[140px] cursor-pointer text-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </>
  );
}

export default PropertyDetailsManager;
