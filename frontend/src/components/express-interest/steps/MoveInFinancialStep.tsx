import { Button } from "@/components/ui/button";
import { StepProps } from "@/lib/types/express-interest";
import { OptionSelectionCard } from "../OptionSelectionCard";

const MOVE_IN_OPTIONS = [
  { value: "immediately", label: "Immediately (Within 1 week)" },
  { value: "2_weeks", label: "Within 2 weeks" },
  { value: "1_month", label: "Within 1 month" },
  { value: "next_semester", label: "Next Semester" },
];

const DEPOSIT_OPTIONS = [
  { value: "ready_now", label: "Yes, ready now" },
  { value: "within_24h", label: "Will arrange within 24 hours" },
  { value: "need_time", label: "Need time to get funds" },
];

const PAYMENT_OPTIONS = [
  {
    value: "cash",
    label: "💵 Cash",
    description: "Physical cash payment",
  },
  {
    value: "mobile",
    label: "📱 Mobile Payment",
    description: "Ecocash, OneMoney, etc.",
  },
  {
    value: "bank_transfer",
    label: "🏦 Bank Transfer",
    description: "Direct bank transfer",
  },
];

/**
 * First step: Collects move-in timeline and financial readiness information
 */
export const MoveInFinancialStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const canProceed = Boolean(
    formData.moveInTimeline &&
      formData.depositReadiness &&
      formData.paymentMethod
  );

  const handleOptionSelect = (
    field: keyof Pick<
      typeof formData,
      "moveInTimeline" | "depositReadiness" | "paymentMethod"
    >,
    value: string
  ) => {
    onUpdate({ [field]: value });
  };

  return (
    <div data-testid="move-in-financial-step">
      <div className="text-center pb-3">
        <h3 className="text-lg font-semibold text-start">
          🎯 Timeline & Readiness
        </h3>
      </div>
      <div className="space-y-6">
        <OptionSelectionCard
          title="1. Move-In Timeline"
          description="When exactly do you need to move in?"
          options={MOVE_IN_OPTIONS}
          selectedValue={formData.moveInTimeline}
          onSelect={(value) => handleOptionSelect("moveInTimeline", value)}
        />

        <OptionSelectionCard
          title="2. Deposit Readiness"
          description="Do you have the security deposit available?"
          options={DEPOSIT_OPTIONS}
          selectedValue={formData.depositReadiness}
          onSelect={(value) => handleOptionSelect("depositReadiness", value)}
        />

        <OptionSelectionCard
          title="3. Payment Method"
          description="How would you pay the deposit?"
          options={PAYMENT_OPTIONS}
          selectedValue={formData.paymentMethod}
          onSelect={(value) => handleOptionSelect("paymentMethod", value)}
          showDescriptions
        />
      </div>

      <div className="flex justify-between pt-4 w-full">
        <Button variant="outline" onClick={onBack} className="h-12 min-w-1/3">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-af-blue h-12 min-w-1/3"
          data-testid="next-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
