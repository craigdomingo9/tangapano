import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import { useEffect } from "react";
import ListingImageDialogContent from "./ListingImageDialogContent";
import createEntityStore from "@/lib/store/entityStore";

export const useListingImageDialogState = createEntityStore<boolean>(false);
export const useListingImageDialogOperation = createEntityStore<
  "add" | "list" | "delete"
>("list");

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
