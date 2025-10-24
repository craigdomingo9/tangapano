import { StepContainer } from "./StepContainer";
import { RoomSelectionStep } from "./steps/RoomSelectionStep";
import { MoveInFinancialStep } from "./steps/MoveInFinancialStep";
import { IdentityVerificationStep } from "./steps/IdentityVerificationStep";
import { AcademicInformationStep } from "./steps/AcademicInformationStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useExpressInterestForm } from "@/lib/hooks/useExpressInterestForm";
import { WhatsAppService } from "@/lib/services/whatsappService";
import { useSelectedListingByStudent } from "@/lib/hooks/store";

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

  const handleComplete = () => {
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
      onClose={onClose}
      currentStep={currentStep}
      listingName={listingName}
    >
      {renderCurrentStep()}
    </StepContainer>
  );
};
