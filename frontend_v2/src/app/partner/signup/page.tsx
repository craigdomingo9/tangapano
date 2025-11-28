"use client";

import { Stepper } from "@/components/partner/signup/Stepper";
import { Step1AccountInfo } from "@/components/partner/signup/Step1AccountInfo";
import { Step2LandlordDetails } from "@/components/partner/signup/Step2LandlordDetails";
import DarkThemeToggle from "@/components/ui/DarkThemeToggle";
import {
  PartnerSignupDataStore,
  usePartnerSignupData,
} from "@/lib/stores/partnerSignupDataStore";
import { Home, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { RegisterSchema, Step1Schema } from "@/lib/validations/partner-signup";
import { signup } from "@/actions/partner/register";

function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PartnerSignupDataStore, string>>
  >({});
  const [processErrors, setProcessErrors] = useState<[string, unknown][]>();

  const {
    entities: formData,
    setEntities: setFormFields,
    reset: resetFormData,
  } = usePartnerSignupData();

  function setFormField(key: keyof PartnerSignupDataStore, value: string) {
    setFormFields({ ...formData, [key]: value });
    // Optional: Clear error for this field as user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  // Shared Handle Change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const storeKey = name as keyof PartnerSignupDataStore;
    setFormField(storeKey, value);
  }

  // Navigation Handlers
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate only Step 1 fields
    const validation = Step1Schema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      password: formData.password,
      confirm_password: formData.confirm_password,
    });

    if (!validation.success) {
      const formatted = validation.error.format();
      // formatted looks like { first_name: { _errors: ["..."] }, password: { _errors: ["..."] }, _errors: [] }

      const newErrors: Partial<Record<keyof PartnerSignupDataStore, string>> =
        {};

      (Object.keys(formatted) as string[]).forEach((key) => {
        // skip the global _errors entry
        if (key === "_errors") return;
        const entry = (formatted as any)[key];
        if (entry && Array.isArray(entry._errors) && entry._errors.length > 0) {
          const typedKey = key as keyof PartnerSignupDataStore;
          newErrors[typedKey] = entry._errors[0];
        }
      });

      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed
    setErrors({});
    setStep(2);
  };

  const handleBack = () => {
    setErrors({}); // Clear errors when going back
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate Full Schema
    const validation = RegisterSchema.safeParse(formData);

    if (!validation.success) {
      const formatted = validation.error.format();
      // formatted looks like { first_name: { _errors: ["..."] }, password: { _errors: ["..."] }, _errors: [] }

      const newErrors: Partial<Record<keyof PartnerSignupDataStore, string>> =
        {};

      (Object.keys(formatted) as string[]).forEach((key) => {
        // skip the global _errors entry
        if (key === "_errors") return;
        const entry = (formatted as any)[key];
        if (entry && Array.isArray(entry._errors) && entry._errors.length > 0) {
          const typedKey = key as keyof PartnerSignupDataStore;
          newErrors[typedKey] = entry._errors[0];
        }
      });

      setErrors(newErrors);
      return;
    }

    // If valid, proceed with submission
    // console.log("Signup submitted successfully", validation.data);
    // Add your API call here

    onRegister();
    resetFormData();
  };

  async function onRegister() {
    startTransition(async () => {
      const result = await signup(formData, window.location.origin);

      if (result && !result.success) {
        // Handle validation or server errors
        setProcessErrors(Object.entries(result.errors));
      }
    });
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-lapis/5 dark:bg-lapis/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] bg-airforce/5 dark:bg-airforce/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-md animate-fade-in relative sm:mt-16">
        <DarkThemeToggle className="absolute top-0 right-0 p-3 rounded-full bg-card border border-border text-text hover:text-primary shadow-lg transition-all z-50 focus:outline-none" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 mb-6 ring-1 ring-slate-100 dark:ring-slate-800">
            <Home className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign Up
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">
            Create your partner account
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <Stepper currentStep={step} />

          <div className="mt-8">
            {step === 1 ? (
              <Step1AccountInfo
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                onNext={handleNext}
              />
            ) : (
              <Step2LandlordDetails
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                onBack={handleBack}
                onSubmit={handleSubmit}
                isPending={isPending}
                processErrors={processErrors}
              />
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xsm text-slate-500 dark:text-slate-400 font-medium mb-2">
              Already have an account?{" "}
              <Link href="/partner/login" prefetch={true}>
                <button className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none cursor-pointer">
                  Login
                </button>
              </Link>
            </p>
            <p className="text-xsm text-slate-500 dark:text-slate-400 font-medium">
              Are you a student?{" "}
              <Link href={"/student"} prefetch={true}>
                <button className="text-lapis dark:text-sky-400 font-bold hover:underline focus:outline-none cursor-pointer">
                  Find Accommodation
                </button>
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            POWERED BY TANGAPANO
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
