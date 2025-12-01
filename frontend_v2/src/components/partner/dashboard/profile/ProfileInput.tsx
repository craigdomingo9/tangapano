import { cn } from "@/lib/utils";
import {
  ProfileFormState,
  useProfileFormData,
} from "../pages/ProfileManagement"; // Ensure correct path

interface ProfileInputProps {
  label: string;
  field: keyof ProfileFormState;
  icon?: React.ReactNode;
  type?: string;
}

// Named with Uppercase 'P' = React Component
export function ProfileInput({
  label,
  field,
  icon,
  type = "text",
}: ProfileInputProps) {
  // Now it's safe to use the hook here
  const { entities: formData, setEntities: setFormData } = useProfileFormData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative mt-2">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={formData[field] || ""} // Fallback to empty string
          onChange={handleChange}
          className={cn(
            "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-lapis dark:focus:border-sky-500 focus:ring-1 focus:ring-lapis dark:focus:ring-sky-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600",
            icon ? "pl-10 pr-4" : "px-4"
          )}
        />
      </div>
    </div>
  );
}
