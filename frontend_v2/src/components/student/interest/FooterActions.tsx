import { Button } from "@/components/ui/button";
import { useExpressInterestStore } from "@/lib/stores/expressInterestStore";
import { MessageCircleMore } from "lucide-react";

interface FooterActionsProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
  listing: Listing;
}
function FooterActions({
  currentStep,
  nextStep,
  prevStep,
  setCurrentStep,
  listing,
}: FooterActionsProps) {
  const {
    entities: {
      fullName,
      studentId,
      whatsappNumber,
      moveInTimeline,
      depositReadiness,
      paymentMethod,
      selectedRoom,
      program,
      yearOfStudy,
      confirmed,
    },
  } = useExpressInterestStore();

  return (
    <>
      {currentStep !== 5 && (
        <div className="bg-slate-50 dark:bg-app-header border-t border-slate-200 dark:border-app-header px-6 py-5 flex justify-between items-center">
          {currentStep === 1 ? (
            // Invisible placeholder to keep alignment
            <div className="w-20"></div>
          ) : (
            <Button
              variant="outline"
              onClick={prevStep}
              className="bg-white dark:bg-slate-800 dark:text-slate-200 border-slate-300 hover:bg-slate-100 text-slate-700 min-w-[100px] cursor-pointer"
            >
              Back
            </Button>
          )}

          <Button
            onClick={nextStep}
            className="bg-lapis hover:bg-lapis-hover text-white px-8 py-6 text-sm font-semibold shadow-md hover:shadow-lg transition-all min-w-[140px] cursor-pointer"
            disabled={
              (currentStep === 1 &&
                (!selectedRoom ||
                  !listing.rooms.find(
                    (room) => room.id === selectedRoom?.id
                  ))) ||
              (currentStep === 2 &&
                (!moveInTimeline || !depositReadiness || !paymentMethod)) ||
              (currentStep === 3 &&
                (!fullName || !studentId || !whatsappNumber)) ||
              (currentStep === 4 && (!program || !yearOfStudy))
            }
          >
            {currentStep === 4 ? "Review & Send" : "Continue"}
          </Button>
        </div>
      )}
    </>
  );
}

export default FooterActions;
