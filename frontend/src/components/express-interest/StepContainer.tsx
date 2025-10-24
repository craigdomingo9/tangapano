import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgressIndicator } from "./ProgressIndicator";

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-center">
              Express Interest in {listingName}
            </DialogTitle>
          </DialogHeader>

          <ProgressIndicator currentStep={currentStep} />
        </div>

        <div className="" data-testid="step-content">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
