import { useExpressInterestDialogState } from "@/lib/hooks/store";
import { ExpressInterestDialogContent } from "./ExpressInterestDialogContent";

/**
 * Container component for the Express Interest dialog
 * Handles dialog state management and renders the multi-step form content
 */
export const ExpressInterestDialog: React.FC = () => {
  const { entities: isDialogOpen, setEntities: setDialogOpen } =
    useExpressInterestDialogState();

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <ExpressInterestDialogContent isOpen={isDialogOpen} onClose={handleClose} />
  );
};

export default ExpressInterestDialog;
