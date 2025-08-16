import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import RoomsDialogContent from "./RoomsDialogContent";
import { useRoomsDialogState } from "@/lib/hooks/store";

function RoomsDialog() {
  const { entities: dialog, setEntities: setDialog } = useRoomsDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Manage Rooms"}
      description="Manage the rooms for your listing."
      onChange={() => setDialog(!dialog)}
    >
      <RoomsDialogContent />
    </DialogContainer>
  );
}

export default RoomsDialog;
