import { Progress } from "@/components/ui/progress";

const STEPS = [
  "Room Selection",
  "Move-in & Financial",
  "Identity Verification",
  "Academic Information",
  "Completion",
];

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = STEPS.length,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2 mx-4" data-testid="progress-indicator">
      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-semibold text-[var(--air-force-blue)]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-semibold text-gray-700">
          {STEPS[currentStep - 1]}
        </span>
      </div>

      <Progress value={progress} className="w-full" />
    </div>
  );
};
