// components/express-interest/steps/academic-information-step.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { FormData } from "@/lib/types/express-interest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface AcademicInformationStepProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PROGRAMS = [
  "Accounting",
  "Business Management",
  "Computer Science",
  "Economics",
  "Engineering",
  "Law",
  "Medicine",
  "Nursing",
  "Psychology",
  "Sociology",
  "Other",
];

export function AcademicInformationStep({
  formData,
  onUpdate,
  onNext,
  onBack,
}: AcademicInformationStepProps) {
  const canProceed =
    formData.program && formData.yearOfStudy && formData.agreeToTerms;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">
          🎓 Final Step: Academic Details
        </h3>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Program Selection */}
          <div className="space-y-2">
            <Label htmlFor="program">7. Program of Study</Label>
            <Select
              value={formData.program}
              onValueChange={(value) => onUpdate({ program: value })}
            >
              <SelectTrigger
                id="program"
                className="w-full focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-500/40"
              >
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year of Study */}
          <fieldset className="w-full max-w-96 space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              Year of Study
            </legend>
            <RadioGroup
              className="grid grid-cols-3 gap-2"
              value={formData.yearOfStudy}
              onValueChange={(value) => onUpdate({ yearOfStudy: value as any })}
            >
              {[
                { value: "1", label: "1st Year" },
                { value: "2", label: "2nd Year" },
                { value: "3", label: "3rd Year" },
                { value: "4+", label: "4th Year+" },
              ].map((item) => (
                <label
                  key={`${item.value}`}
                  className={cn(
                    "border-input cursor-pointer has-data-[state=checked]:border-primary/80 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
                    formData.yearOfStudy === item.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <RadioGroupItem
                    id={`${item.value}`}
                    value={item.value}
                    className={cn(
                      "sr-only after:absolute focus-visible:border-blue-500 focus-visible:bg-blue-50 after:inset-0 p-3 text-center rounded-lg border-2 transition-all"
                    )}
                    aria-label={`size-radio-${item.value}`}
                  />
                  <p className="text-foreground text-sm leading-none font-medium">
                    {item.label}
                  </p>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                onUpdate({ agreeToTerms: checked as boolean })
              }
            />
            <div className="grid gap-2">
              <Label htmlFor="agreeToTerms" className="leading-4">
                By continuing, I confirm all information is accurate
              </Label>
              <p className="text-muted-foreground text-xs">
                I understand that this information will be shared with the
                landlord to process my interest in this accommodation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="h-12 min-w-1/3">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="min-w-1/3 bg-af-blue h-12"
          data-testid="next-button"
        >
          Review & Send
        </Button>
      </div>
    </div>
  );
}
