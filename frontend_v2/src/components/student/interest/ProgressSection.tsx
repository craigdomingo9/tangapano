interface ProgressSectionProps {
  currentStep: number;
  getStepProgress: () => number;
  STEPS: { id: number; title: string }[];
}

function ProgressSection({
  currentStep,
  getStepProgress,
  STEPS,
}: ProgressSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm font-semibold text-lapis mb-3">
        <span>Step {currentStep} of 5</span>
        <span>{STEPS[currentStep - 1].title}</span>
      </div>
      <div className="h-2 w-full bg-slate-200/50 dark:bg-slate-400/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-lapis dark:bg-blue-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          style={{ width: `${getStepProgress()}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressSection;
