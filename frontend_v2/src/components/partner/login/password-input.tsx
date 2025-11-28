"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  showForgotPassword?: boolean;
  onForgotPassword?: () => void;
}

export function PasswordInput({
  form,
  name,
  label = "Password",
  placeholder = "••••••••",
  disabled,
  autoComplete = "current-password",
  showForgotPassword = false,
  onForgotPassword,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {label}
            </FormLabel>
            {showForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-semibold text-lapis dark:text-sky-400 hover:underline focus:outline-none focus:ring-2 focus:ring-lapis rounded px-1"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={cn(
                  "pl-10 pr-10",
                  "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800",
                  "focus-visible:ring-blue-500",
                  fieldState.error &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-lapis rounded p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
