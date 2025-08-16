import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import LandlordDialogContent from "./LandlordDialogContent";
import { useLandlordDialogState } from "@/lib/hooks/store";

function LandlordDialog() {
  const { entities: dialog, setEntities: setDialog } = useLandlordDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Edit Landlord Information"}
      onChange={() => setDialog(!dialog)}
    >
      <LandlordDialogContent />
    </DialogContainer>
  );
}

export default LandlordDialog;
