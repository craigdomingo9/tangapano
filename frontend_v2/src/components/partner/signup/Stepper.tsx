import React from "react";
import { User, Building, Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Account Info", icon: User },
    { id: 2, label: "Landlord Details", icon: Building },
  ];

  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center justify-between w-full max-w-xs mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500 ease-in-out bg-sky-400 shadow-lg shadow-sky-400"
          style={{ width: currentStep === 1 ? "50%" : "100%" }}
        ></div>

        {steps.map((step) => {
          const isActive = currentStep >= step.id;
          const isCompleted = currentStep > step.id;
          const Icon = isCompleted ? Check : step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-4 
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-sky-500 shadow-md text-slate-100 shadow-sky-400 border-sky-500 shadow-glow"
                      : "bg-card border-border text-textMuted"
                  }
                `}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <span
                className={`
                absolute top-14 text-xs font-medium whitespace-nowrap transition-colors duration-300
                ${isActive ? "text-text" : "text-textMuted"}
              `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
