import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import AmenitiesDialogContent from "./AmenitiesDialogContent";
import { useAmenitiesDialogState } from "@/lib/hooks/store";

function AmenitiesDialog() {
  const { entities: dialog, setEntities: setDialog } =
    useAmenitiesDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Manage Amenities"}
      description="Manage the amenities for your listing."
      onChange={() => setDialog(!dialog)}
    >
      <AmenitiesDialogContent />
    </DialogContainer>
  );
}

export default AmenitiesDialog;
