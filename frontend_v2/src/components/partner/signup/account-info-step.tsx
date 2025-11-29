import { UseFormReturn } from "react-hook-form";
import { User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "../common-components/form-input";
import { Step1FormData } from "@/lib/validations/partner-signup";

interface AccountInfoStepProps {
  form: UseFormReturn<Step1FormData>;
  onNext: () => void;
}

export function AccountInfoStep({ form, onNext }: AccountInfoStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-text">Account Information</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your personal details below
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          form={form}
          name="first_name"
          label="First Name"
          placeholder="Tafadzwa"
          icon={User}
          autoComplete="given-name"
        />
        <FormInput
          form={form}
          name="last_name"
          label="Last Name"
          placeholder="Mukwati"
          icon={User}
          autoComplete="family-name"
        />
      </div>

      <FormInput
        form={form}
        name="username"
        label="Username"
        placeholder="e.g. arnoldtmukwati"
        icon={User}
        autoComplete="username"
      />

      <FormInput
        form={form}
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={Lock}
        autoComplete="new-password"
      />

      <FormInput
        form={form}
        name="confirm_password"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        icon={Lock}
        autoComplete="new-password"
      />

      <div className="pt-2">
        <Button
          type="button"
          onClick={onNext}
          className="w-full h-12 text-base dark:text-white/90 font-bold bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 shadow-lg shadow-lapis/20 dark:shadow-sky-500/20 transition-all mt-2 cursor-pointer"
          size="lg"
        >
          Next Step
          <ArrowRight
            size={18}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>
  );
}
