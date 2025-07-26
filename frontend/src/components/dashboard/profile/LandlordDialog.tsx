import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import createEntityStore from "@/lib/store/entityStore";
import { useEffect } from "react";
import LandlordDialogContent from "./LandlordDialogContent";


export const useLandlordDialogState = createEntityStore<boolean>(false);

function LandlordDialog() {
  const { entities: dialog, setEntities: setDialog } = useLandlordDialogState();

  useEffect(() => {}, [dialog])

  return (
    <DialogContainer 
      state={dialog} 
      title={'Edit Landlord Information'} 
      onChange={() => setDialog(!dialog)}
    >
      <LandlordDialogContent />
    </DialogContainer>
  )
}

export default LandlordDialog
