import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgressIndicator } from "./ProgressIndicator";
import { Separator } from "../ui/separator";

interface StepContainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  listingName: string;
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({
  isOpen,
  onClose,
  currentStep,
  listingName,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide pt-0 px-0">
        <div className="space-y-5 sticky top-0 z-[199] bg-white pt-4 pb-6">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-900 px-2">
              Express Interest in {listingName}
            </DialogTitle>
          </DialogHeader>
          <Separator className="bg-gray-300" />

          <ProgressIndicator currentStep={currentStep} />
        </div>

        <div className="mx-4" data-testid="step-content">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
