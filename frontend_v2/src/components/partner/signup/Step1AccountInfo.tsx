"use client";

import { Button } from "@/components/partner/signup/Button";
import { Input } from "@/components/partner/signup/Input";
import { PartnerSignupDataStore } from "@/lib/stores/partnerSignupDataStore";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

interface Step1Props {
  formData: PartnerSignupDataStore;
  errors: Partial<Record<keyof PartnerSignupDataStore, string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: (e: React.FormEvent) => void;
}

export function Step1AccountInfo({
  formData,
  errors,
  handleChange,
  onNext,
}: Step1Props) {
  return (
    <form
      id="step1-form"
      onSubmit={onNext}
      className="space-y-5 animate-slide-in-right"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-text mt-4">
          Account Information
        </h2>
        <p className="text-xs text-textMuted">
          Enter your personal details below
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Tafadzwa"
          icon={User}
          error={errors.first_name}
        />
        <Input
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Mukwati"
          icon={User}
          error={errors.last_name}
        />
      </div>
      {/* <Input
        label="Email (Optional)"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="arnold@example.com"
        icon={Mail}
        error={errors.email}
      /> */}
      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="e.g. arnoldtmukwati"
        icon={User}
        error={errors.username}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        error={errors.password}
      />
      <Input
        label="Confirm Password"
        name="confirm_password"
        type="password"
        value={formData.confirm_password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        error={errors.confirm_password}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="group cursor-pointer"
        >
          Next Step
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </form>
  );
}
