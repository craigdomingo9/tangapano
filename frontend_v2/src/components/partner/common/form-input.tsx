import React from "react";
import { UseFormReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  autoComplete?: string;
}

export function FormInput({
  form,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  disabled,
  autoComplete,
}: FormInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              )}
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={cn(
                  Icon && "pl-10",
                  "bg-slate-50 text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800",
                  "focus-visible:ring-blue-500",
                  fieldState.error &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
