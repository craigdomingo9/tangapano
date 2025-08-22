import { useListingDialogMode } from "@/lib/hooks/store";
import AddNewListing from "./AddNewListing";
import DeleteExistingListing from "./DeleteExistingListing";
import EditExistingListing from "./EditExistingListing";

function ListingDialogContent() {
  const { entities: operation } = useListingDialogMode();

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
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm relative">
        {renderOperationView()}
      </div>
    </div>
  );
}

export default ListingDialogContent;
