import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ValidationService } from "@/lib/services/validationService";
import { StepProps } from "@/lib/types/express-interest";
import { PhoneNumberInput } from "../PhoneNumberInput";

/**
 * Second step: Collects and validates student identity information
 */
export const IdentityVerificationStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationResult = ValidationService.validateStep2(formData);
  const canProceed = validationResult.isValid;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    onUpdate({ [field]: value });

    // Real-time validation
    const newErrors = { ...errors };
    let error: string | null = null;

    switch (field) {
      case "fullName":
        error = ValidationService.validateFullName(value);
        break;
      case "studentId":
        error = ValidationService.validateStudentId(value.trim());
        break;
      case "whatsappNumber":
        error = ValidationService.validateWhatsAppNumber(value);
        break;
    }

    if (error) {
      newErrors[field] = error;
    } else {
      delete newErrors[field];
    }

    setErrors(newErrors);
  };

  const handleNext = () => {
    const result = ValidationService.validateStep2(formData);
    if (result.isValid) {
      onNext();
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <div className="space-y-6" data-testid="identity-verification-step">
      <div className="text-start">
        <h3 className="text-lg font-semibold">📋 Let's Get You Verified</h3>
      </div>

      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700">
              4. Full Legal Name
            </Label>
            <Input
              id="fullName"
              placeholder="As it appears on your student ID"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : "text-sm"}
              data-testid="full-name-input"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2 text-gray-700">
            <Label htmlFor="studentId">5. Student ID Number</Label>
            <Input
              id="studentId"
              placeholder="Your official student ID"
              value={formData.studentId}
              onChange={(e) =>
                handleInputChange("studentId", e.target.value.toUpperCase())
              }
              className={errors.studentId ? "border-red-500" : "text-sm"}
              data-testid="student-id-input"
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm">{errors.studentId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber" className="text-gray-700">
              6. WhatsApp Number
            </Label>
            <PhoneNumberInput
              value={formData.whatsappNumber}
              onChange={(value) => handleInputChange("whatsappNumber", value)}
              error={errors.whatsappNumber}
            />
            <p className="text-sm text-gray-600">
              We'll use this for important updates and viewings
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          className="min-w-1/3 h-12"
          onClick={onBack}
          data-testid="back-button"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="min-w-1/3 h-12 bg-af-blue"
          data-testid="next-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
