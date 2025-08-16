import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import UserDialogContent from "./UserDialogContent";
import { useUserDialogState } from "@/lib/hooks/store";

function UserDialog() {
  const { entities: dialog, setEntities: setDialog } = useUserDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Edit User Information"}
      onChange={() => setDialog(!dialog)}
    >
      <UserDialogContent />
    </DialogContainer>
  );
}

export default UserDialog;
