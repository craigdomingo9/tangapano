import createEntityStore from "@/lib/store/entityStore";
import DialogContainer from "../universal/Dialog/DialogContainer";
import { useEffect } from "react";
import ContactAgentDialogContent from "./ContactAgentDialogContent";


export const useContactAgentDialogState = createEntityStore<boolean>(false);
export const useSelectedListingByStudent = createEntityStore<Listing>({} as Listing);

function ContactAgentDialog() {
  
  const { entities: dialog, setEntities: setDialog } = useContactAgentDialogState();

  useEffect(() => {}, [dialog])

  return (
    <DialogContainer 
      state={dialog} 
      title={'Contact Agent on Whatsapp'} 
      onChange={() => setDialog(!dialog)}
    >
      <ContactAgentDialogContent />
    </DialogContainer>
  )
}

export default ContactAgentDialog
