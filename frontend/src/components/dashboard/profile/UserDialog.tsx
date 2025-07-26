import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import createEntityStore from "@/lib/store/entityStore";
import { useEffect } from "react";
import UserDialogContent from "./UserDialogContent";

export const useUserDialogState = createEntityStore<boolean>(false);

function UserDialog() {
  const { entities: dialog, setEntities: setDialog } = useUserDialogState();

  useEffect(() => {}, [dialog])

  return (
    <DialogContainer 
      state={dialog} 
      title={'Edit User Information'} 
      onChange={() => setDialog(!dialog)}
    >
      <UserDialogContent />
    </DialogContainer>
  )
}

export default UserDialog
