"use client";

import { Button } from "@/components/partner/signup/Button";
import { Input } from "@/components/partner/signup/Input";
import { PartnerSignupDataStore } from "@/lib/stores/partnerSignupDataStore";
import { ArrowLeft, Building, Check, MapPin, Phone, X } from "lucide-react";

interface Step2Props {
  formData: PartnerSignupDataStore;
  errors: Partial<Record<keyof PartnerSignupDataStore, string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  processErrors: [string, any][] | undefined;
}

export function Step2LandlordDetails({
  formData,
  errors,
  handleChange,
  onBack,
  onSubmit,
  isPending,
  processErrors,
}: Step2Props) {
  return (
    <form
      id="step2-form"
      onSubmit={onSubmit}
      className="space-y-5 animate-slide-in-right"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-text mt-4">
          Landlord Details
        </h2>
        <p className="text-xs text-textMuted">
          Enter your business information
        </p>
      </div>

      {processErrors?.map(([key, messages]) => (
        <div
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2"
          key={key}
        >
          <X className="w-4 h-4" />
          {messages[0] as any}
        </div>
      ))}

      <Input
        label="Company Name"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        placeholder="Mukwati Properties"
        icon={Building}
        error={errors.company_name}
      />
      <Input
        label="Phone Number"
        name="phone_number"
        type="tel"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="e.g. +263 789 456 123"
        icon={Phone}
        error={errors.phone_number}
      />
      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="123 Main St, Harare"
        icon={MapPin}
        error={errors.address}
      />

      <div className="pt-4 grid grid-cols-[30%_10%_60%]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="cursor-pointer text-sm text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <div />
        <Button
          type="submit"
          variant="primary"
          className="cursor-pointer text-sm sm:text-base"
        >
          {isPending ? (
            "Creating Account..."
          ) : (
            <>
              Create Account <Check size={18} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
