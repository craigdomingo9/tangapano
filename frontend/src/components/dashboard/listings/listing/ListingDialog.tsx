import DialogContainer from "@/components/universal/Dialog/DialogContainer";
import createEntityStore from "@/lib/store/entityStore";
import { useEffect } from "react";
import ListingDialogContent from "./ListingDialogContent";

export const useListingDialogState = createEntityStore<boolean>(false);
export const useListingDialogOperation = createEntityStore<
  "add" | "edit" | "delete"
>("add");

function ListingDialog() {
  const { entities: dialog, setEntities: setDialog } = useListingDialogState();
  const { entities: operation } = useListingDialogOperation();

  useEffect(() => {}, [dialog]);

  const titleMap = {
    add: "Add New Listing",
    edit: "Edit Listing",
    delete: "Delete Listing",
  };

  const descriptionMap = {
    add: "Add a new listing",
    edit: "Edit an existing listing",
    delete: "Delete an existing listing",
  };

  return (
    <DialogContainer
      state={dialog}
      title={titleMap[operation]}
      description={descriptionMap[operation]}
      onChange={() => setDialog(!dialog)}
    >
      <ListingDialogContent />
    </DialogContainer>
  );
}

export default ListingDialog;
