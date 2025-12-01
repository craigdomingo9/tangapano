import { useCampuses } from "@/hooks/use-reference-data";
import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Briefcase, Loader2, Sparkles, TrendingUp, User } from "lucide-react";
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
          <div className="flex items-center dark:bg-slate-800/50 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-lapis dark:focus-within:ring-sky-500 focus-within:border-lapis dark:focus-within:border-sky-500">
            <button
              onClick={() => handleDistanceChange(-5)}
              className="h-full px-5 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
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
              className="h-full px-5 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <span className="text-base font-bold cursor-pointer">+</span>
            </button>
          </div>
        </div>

        {/* Agent Fee Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
          <div
            className="flex flex-col cursor-pointer"
            onClick={() =>
              onChange("apply_agent_fee", !formState.apply_agent_fee)
            }
          >
            <label className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer">
              Agent Fee Applicable
            </label>
            <span className="text-[0.675rem] sm:text-xs text-slate-500 dark:text-slate-400">
              Should we charge the student an agent fee?
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
        {/* Prominent Info Card */}
        <div
          className={cn(
            "p-5 rounded-lg border-l-4 shadow-sm transition-all duration-300",
            formState.apply_agent_fee
              ? "bg-amber-50 dark:bg-amber-900/10 border-amber-400 text-amber-900 dark:text-amber-100"
              : "bg-blue-50 dark:bg-sky-900/10 border-lapis dark:border-sky-400 text-blue-900 dark:text-sky-100"
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              {formState.apply_agent_fee ? (
                <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-lapis dark:text-sky-400" />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-xsm uppercase tracking-wide opacity-90">
                  {formState.apply_agent_fee
                    ? "Student-Paid Model"
                    : "Success Fee Model"}
                </p>
                {!formState.apply_agent_fee && (
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 animate-pulse">
                    <TrendingUp className="w-3 h-3" />
                    High Demand
                  </span>
                )}
              </div>

              {formState.apply_agent_fee ? (
                <p className="text-xsm leading-relaxed opacity-90">
                  The student will be charged a standard agent fee to access
                  your contact details or book this property. While no cost to
                  you, this may reduce student interest.
                </p>
              ) : (
                <div className="text-xsm leading-relaxed opacity-90 space-y-3">
                  <p>
                    <span className="font-bold">Maximize your inquiries!</span>{" "}
                    Students rush to listings without agent fees because they
                    are cheaper upfront.
                  </p>
                  <div className="flex items-start gap-2 bg-white/60 dark:bg-black/20 p-3 rounded-md border border-blue-200/50 dark:border-sky-500/20">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-lapis dark:text-sky-400 shrink-0" />
                    <p className="text-xs font-medium">
                      <strong>Competitive Advantage:</strong> By removing the
                      student fee, you expose your property to a wider audience.
                      You only pay a success fee upon placement.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
