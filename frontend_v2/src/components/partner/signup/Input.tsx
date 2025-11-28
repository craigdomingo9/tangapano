import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  icon: Icon,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          className={`
            w-full px-4 ${Icon ? "pl-10" : ""} py-2.5 
            bg-slate-50 dark:bg-slate-900 
            border ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500"
            }
            rounded-lg text-sm
            text-slate-900 dark:text-white
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            transition-all
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
