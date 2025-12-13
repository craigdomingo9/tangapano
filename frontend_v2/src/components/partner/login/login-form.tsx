"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "@/components/common/form-input";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/partner-auth";
import { login } from "@/actions/partner/auth";
import { PasswordInput } from "./password-input";
import { errorToast, infoToast, successToast } from "@/lib/toast";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(undefined);

    startTransition(async () => {
      try {
        const result = await login(data, window.location.origin);

        if (result && !result.success) {
          const errorMessage =
            // @ts-ignore
            (result.errors?.general as string) ||
            "Login failed. Please check your credentials.";
          setServerError(errorMessage);
          errorToast(errorMessage);
        } else {
          successToast("Login successful!");
        }
      } catch (error) {
        const errorMessage = "An unexpected error occurred. Please try again.";
        setServerError(errorMessage);
        // errorToast(errorMessage);
        console.error("Login error:", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {serverError && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-2"
          >
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <FormInput
          form={form}
          name="username"
          label="Username"
          placeholder="Enter your username"
          icon={User}
          autoComplete="username"
          disabled={isPending}
        />

        <PasswordInput
          form={form}
          name="password"
          // showForgotPassword
          onForgotPassword={() => infoToast("Password reset coming soon!")}
          disabled={isPending}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-base font-bold bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 shadow-lg shadow-lapis/20 dark:shadow-sky-500/20 transition-all mt-2 text-white cursor-pointer"
          size="lg"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}
