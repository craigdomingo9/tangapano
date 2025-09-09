import DialogContainer from "../universal/Dialog/DialogContainer";
import { useEffect } from "react";
import ContactAgentDialogContent from "./ContactAgentDialogContent";
import { useContactAgentDialogState } from "@/lib/hooks/store";

function ContactAgentDialog() {
  const { entities: dialog, setEntities: setDialog } =
    useContactAgentDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Get in Touch"}
      onChange={() => setDialog(!dialog)}
    >
      <ContactAgentDialogContent />
    </DialogContainer>
  );
}

export default ContactAgentDialog;
