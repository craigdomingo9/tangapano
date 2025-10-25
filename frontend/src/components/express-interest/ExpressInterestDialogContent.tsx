import { StepContainer } from "./StepContainer";
import { RoomSelectionStep } from "./steps/RoomSelectionStep";
import { MoveInFinancialStep } from "./steps/MoveInFinancialStep";
import { IdentityVerificationStep } from "./steps/IdentityVerificationStep";
import { AcademicInformationStep } from "./steps/AcademicInformationStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useExpressInterestForm } from "@/lib/hooks/useExpressInterestForm";
import { WhatsAppService } from "@/lib/services/whatsappService";
import { useSelectedListingByStudent } from "@/lib/hooks/store";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/services/api/config";
import { InterestModel } from "@/lib/types/express-interest";

interface ExpressInterestDialogContentProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Main component for the multi-step express interest form
 * Manages step navigation and form submission
 */
export const ExpressInterestDialogContent: React.FC<
  ExpressInterestDialogContentProps
> = ({ isOpen, onClose }) => {
  const {
    currentStep,
    formData,
    updateFormData,
    resetForm,
    goToNextStep,
    goToPreviousStep,
  } = useExpressInterestForm();

  const { entities: selectedListing } = useSelectedListingByStudent();

  const listingName = selectedListing?.title;
  const selectedRoom =
    selectedListing?.rooms?.find(
      (room) => room.id === formData.selectedRoomId
    ) || null;

  const mutation = useMutation({
    mutationFn: (data: InterestModel) =>
      axiosInstance.post("/interests/interests/", data),
  });

  const handleComplete = () => {
    mutation.mutate({
      room: formData.selectedRoomId,
      contacted_agent: selectedListing!.campus.agent.id,
      full_name: formData.fullName,
      student_id: formData.studentId,
      phone_number: formData.whatsappNumber,
      year_of_study: formData.yearOfStudy,
      program: formData.program,
      move_in_timeline: formData.moveInTimeline,
      deposit_readiness: formData.depositReadiness,
      payment_method: formData.paymentMethod,
      agree_to_terms: formData.agreeToTerms,
    });

    WhatsAppService.sendMessage(
      {
        formData,
        listingName,
        selectedRoom,
        selectedListing,
      },
      selectedListing.campus.agent.phone_number
    );

    resetForm();
    onClose();
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      onUpdate: updateFormData,
      onNext: goToNextStep,
      onBack: goToPreviousStep,
    };

    switch (currentStep) {
      case 1:
        return <RoomSelectionStep {...stepProps} />;
      case 2:
        return <MoveInFinancialStep {...stepProps} />;
      case 3:
        return <IdentityVerificationStep {...stepProps} />;
      case 4:
        return <AcademicInformationStep {...stepProps} />;
      case 5:
        return (
          <CompletionStep
            {...stepProps}
            listingName={listingName}
            selectedRoom={selectedRoom}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StepContainer
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      currentStep={currentStep}
      listingName={listingName}
    >
      {renderCurrentStep()}
    </StepContainer>
  );
};
