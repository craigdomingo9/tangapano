import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import RoomsDialogContent from "./RoomsDialogContent";
import { useRoomsDialogState } from "@/lib/hooks/store";

type Props = {
  dismissDialogOnAction?: boolean;
};

function RoomsDialog({ dismissDialogOnAction }: Props) {
  const { entities: dialog, setEntities: setDialog } = useRoomsDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Manage Rooms"}
      description="Manage the rooms for your listing."
      onChange={() => setDialog(!dialog)}
    >
      <RoomsDialogContent dismissDialogOnAction={dismissDialogOnAction} />
    </DialogContainer>
  );
}

export default RoomsDialog;
