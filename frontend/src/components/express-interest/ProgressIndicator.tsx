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
    <div className="space-y-2" data-testid="progress-indicator">
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{STEPS[currentStep - 1]}</span>
      </div>

      <Progress value={progress} className="w-full" />

      {/* Visual Step Indicators */}
      <div className="flex justify-center space-x-2">
        {STEPS.slice(0, totalSteps).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index + 1 === currentStep
                ? "bg-blue-600"
                : index + 1 < currentStep
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
            aria-label={`Step ${index + 1}: ${STEPS[index]}`}
          />
        ))}
      </div>
    </div>
  );
};
