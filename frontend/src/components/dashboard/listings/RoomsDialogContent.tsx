import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useSelectedListing } from "../CardButtons";
import { useIsMobile } from "@/hooks/use-mobile";
import AddNewRoom from "./AddNewRoom";
import EditExistingRoom from "./EditExistingRoom";
import DeleteExistingRoom from "./DeleteExistingRoom";
import createEntityStore from "@/lib/store/entityStore";

export const useRoomsDialogOperation = createEntityStore<"list" | "add" | "edit" | "delete">("list");
export const useSelectedRoom = createEntityStore<Room>({} as Room);

function RoomsDialogContent() {
  const { entities: selectedListing } = useSelectedListing();
  const { entities: operation, setEntities: setOperation } = useRoomsDialogOperation();
  const { setEntities: setSelectedRoom } = useSelectedRoom();

  const renderRoomList = () => (
    <>
      <Button className="w-full" onClick={() => setOperation("add")}>
        <PlusCircle size={20} className="mr-2" />
        Add New Room
      </Button>

      {selectedListing?.rooms?.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No rooms added for this listing yet.</p>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mt-4">
          {selectedListing?.rooms.map((room, index) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-800">Room {index + 1}</p>
                <p className="text-gray-600 text-sm">
                  ${parseFloat(room.rent_per_month).toFixed(2)} / month
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setOperation("edit");
                  }}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setOperation("delete");
                  }}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderOperationView = () => {
    switch (operation) {
      case "add":
        return <AddNewRoom />;
      case "edit":
        return <EditExistingRoom />;
      case "delete":
        return <DeleteExistingRoom />;
      default:
        return renderRoomList();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg relative">
      {renderOperationView()}
    </div>
  );
}

export default RoomsDialogContent;
