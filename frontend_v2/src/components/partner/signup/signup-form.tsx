"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { StepIndicator } from "./step-indicator";
import { AccountInfoStep } from "./account-info-step";
import { LandlordDetailsStep } from "./landlord-details-step";
import { signup } from "@/actions/partner/register";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import {
  RegistrationFormData,
  registrationSchema,
} from "@/lib/validations/partner-signup";
import { errorToast, successToast } from "@/lib/toast";

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>();

  const {
    currentStep,
    nextStep,
    previousStep,
    reset: resetSteps,
  } = useMultiStepForm({
    totalSteps: 2,
  });

  // Combined form for all steps
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
    defaultValues: {
      first_name: "Craig",
      last_name: "Domingo",
      username: "ktb",
      password: "password123",
      confirm_password: "password123",
      company_name: "Domingo Properties",
      phone_number: "+254712345678",
      address: "Nairobi, Kenya",
    },
  });

  const handleNextStep = async () => {
    // Validate only step 1 fields
    const step1Fields = {
      first_name: form.getValues("first_name"),
      last_name: form.getValues("last_name"),
      username: form.getValues("username"),
      password: form.getValues("password"),
      confirm_password: form.getValues("confirm_password"),
    };

    const result = await form.trigger(Object.keys(step1Fields) as any);

    if (result) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const isValid = await form.trigger();

    if (!isValid) {
      errorToast("Please fix the errors before submitting");
      return;
    }

    const formData = form.getValues();

    startTransition(async () => {
      try {
        const result = await signup(formData, window.location.origin);

        if (result && !result.success) {
          setServerErrors(result.errors);
          errorToast("Registration failed. Please check the errors.");
        } else {
          successToast("Account created successfully!");
          form.reset();
          resetSteps();
          // Redirect or handle success
        }
      } catch (error) {
        errorToast("An unexpected error occurred. Please try again.");
        console.error("Signup error:", error);
      }
    });
  };

  return (
    <div className="w-full">
      <StepIndicator currentStep={currentStep} />

      <Form {...form}>
        <div className="mt-8">
          {currentStep === 1 ? (
            <AccountInfoStep form={form as any} onNext={handleNextStep} />
          ) : (
            <LandlordDetailsStep
              form={form as any}
              onBack={previousStep}
              onSubmit={handleSubmit}
              isPending={isPending}
              serverErrors={serverErrors}
            />
          )}
        </div>
      </Form>
    </div>
  );
}
