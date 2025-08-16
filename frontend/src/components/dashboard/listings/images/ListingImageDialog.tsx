import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import ListingImageDialogContent from "./ListingImageDialogContent";
import { useListingImageDialogState } from "@/lib/hooks/store";

function ListingImageDialog() {
  const { entities: dialog, setEntities: setDialog } =
    useListingImageDialogState();

  useEffect(() => {}, [dialog]);

  return (
    <DialogContainer
      state={dialog}
      title={"Manage Images"}
      description="Manage the images for your listing."
      onChange={() => setDialog(!dialog)}
    >
      <ListingImageDialogContent />
    </DialogContainer>
  );
}

export default ListingImageDialog;
