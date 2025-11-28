import { useState, useCallback } from "react";

interface UseMultiStepFormProps {
  totalSteps: number;
  initialStep?: number;
}

export function useMultiStepForm({
  totalSteps,
  initialStep = 1,
}: UseMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    reset,
    isFirstStep,
    isLastStep,
    progress,
    totalSteps,
  };
}
