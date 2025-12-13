import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Building, Phone, MapPin, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "../../common/form-input";
import { Step2FormData } from "@/lib/validations/partner-signup";

interface LandlordDetailsStepProps {
  form: UseFormReturn<Step2FormData>;
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
  serverErrors?: Record<string, string[]>;
}

export function LandlordDetailsStep({
  form,
  onBack,
  onSubmit,
  isPending,
  serverErrors,
}: LandlordDetailsStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-text">Landlord Details</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your business information
        </p>
      </div>

      {serverErrors &&
        Object.entries(serverErrors).map(([key, messages]) => (
          <Alert key={key} variant="destructive">
            <AlertDescription>{messages[0]}</AlertDescription>
          </Alert>
        ))}

      <FormInput
        form={form}
        name="company_name"
        label="Company Name (Optional)"
        placeholder="Mukwati Properties"
        icon={Building}
        autoComplete="organization"
        disabled={isPending}
      />

      <FormInput
        form={form}
        name="phone_number"
        label="Phone Number"
        type="tel"
        placeholder="e.g. +263 789 456 123"
        icon={Phone}
        autoComplete="tel"
        disabled={isPending}
      />

      <FormInput
        form={form}
        name="address"
        label="Address (Optional)"
        placeholder="123 Main St, Harare"
        icon={MapPin}
        autoComplete="street-address"
        disabled={isPending}
      />

      <div className="pt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="flex-1 h-12 cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="flex-2 w-full h-12 text-base dark:text-white/90 font-bold bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 shadow-lg shadow-lapis/20 dark:shadow-sky-500/20 transition-all cursor-pointer"
          size="lg"
        >
          {isPending ? (
            "Creating Account..."
          ) : (
            <>
              Create Account
              <Check size={18} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
