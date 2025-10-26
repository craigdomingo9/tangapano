import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { FormData } from "@/lib/types/express-interest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { universityProgrammes } from "@/lib/lists/universityProgrammes";
import { Fragment } from "react";

interface AcademicInformationStepProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

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
      <div className="text-start">
        <h3 className="text-lg font-semibold">
          🎓 Final Step: Academic Details
        </h3>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* Program Selection */}
          <div className="w-full max-w-xs space-y-2 [&>*]:font-semibold [&>*]:text-gray-700">
            <Label htmlFor="program" className="font-medium">
              7. Program of Study
            </Label>
            <Select
              value={formData.program}
              onValueChange={(value) => onUpdate({ program: value })}
            >
              <SelectTrigger
                id="program"
                className="w-full [&>span]:truncate [&>span]:max-w-3xs [&>span]:text-ellipsis max-w-3xs"
              >
                <SelectValue
                  placeholder="Select program"
                  className="truncate text-ellipsis"
                />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(universityProgrammes).map((category) => (
                  <Fragment key={category}>
                    <SelectGroup>
                      <SelectLabel>{category}</SelectLabel>
                      {universityProgrammes[category].map((programme) => (
                        <SelectItem
                          key={programme}
                          value={programme}
                          className="max-w-3xs truncate"
                        >
                          {/* {programme.slice(0, 22)}
                          {programme.length > 22 ? "..." : ""} */}
                          {programme}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    {category !== "Other" && <SelectSeparator />}
                  </Fragment>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year of Study */}
          <fieldset className="w-full max-w-96 space-y-4">
            <legend className="text-sm leading-none font-medium text-gray-700">
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
                    "border-input text-gray-700 cursor-pointer has-data-[state=checked]:border-primary/80 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
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
