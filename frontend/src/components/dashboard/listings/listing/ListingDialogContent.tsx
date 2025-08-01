import AddNewListing from "./AddNewListing";
import DeleteExistingListing from "./DeleteExistingListing";
import EditExistingListing from "./EditExistingListing";
import { useListingDialogOperation } from "./ListingDialog";

function ListingDialogContent() {
  const { entities: operation } = useListingDialogOperation();

  const renderOperationView = () => {
    switch (operation) {
      case "add":
        return <AddNewListing />;
      case "edit":
        return <EditExistingListing />;
      case "delete":
        return <DeleteExistingListing />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg relative">
      {renderOperationView()}
    </div>
  );
}

export default ListingDialogContent;
