import React from "react";
import { User, Building, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
}

interface StepIndicatorProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { id: 1, label: "Account Info", icon: User },
  { id: 2, label: "Landlord Details", icon: Building },
];

export function StepIndicator({
  currentStep,
  steps = defaultSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center justify-between w-full max-w-xs mx-auto">
        {/* Progress Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-border rounded-full z-0"
          style={{ width: "100%" }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0",
            "transition-all duration-500 ease-in-out",
            "bg-sky-400 shadow-lg shadow-sky-400/50"
          )}
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          aria-hidden="true"
        />

        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCompleted = currentStep > step.id;
          const StepIcon = isCompleted ? Check : step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
              role="listitem"
              aria-current={currentStep === step.id ? "step" : undefined}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  "border-4 transition-all duration-300",
                  isActive
                    ? "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-400/50"
                    : "bg-card border-border text-textMuted"
                )}
              >
                <StepIcon size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <span
                className={cn(
                  "absolute top-14 text-xs font-medium whitespace-nowrap",
                  "transition-colors duration-300",
                  isActive ? "text-text" : "text-textMuted"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
      </div>
    </div>
  );
}
