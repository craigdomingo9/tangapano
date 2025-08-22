import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import AddNewRoom from "./AddNewRoom";
import DeleteExistingRoom from "./DeleteExistingRoom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EditExistingRoom from "./EditExistingRoom";
import { MoonLoader } from "react-spinners";
import { cn } from "@/lib/utils";
import {
  useRoomsDialogOperation,
  useSelectedListing,
  useSelectedRoom,
} from "@/lib/hooks/store";

type Props = {
  dismissDialogOnAction?: boolean;
};

function RoomsDialogContent({ dismissDialogOnAction }: Props) {
  const { entities: selectedListing } = useSelectedListing();
  const { entities: operation, setEntities: setOperation } =
    useRoomsDialogOperation();
  const { setEntities: setSelectedRoom } = useSelectedRoom();

  const { data: rooms, status } = useQuery({
    queryKey: ["rooms", selectedListing?.id],
    queryFn: () =>
      axios.get(`/server/api/landlord-listings/${selectedListing?.id}/rooms`),
    enabled: !!selectedListing?.id,
  });

  const roomsData: Room[] = rooms?.data;

  const renderRoomList = () => (
    <>
      <Button className="w-full mb-2" onClick={() => setOperation("add")}>
        <PlusCircle size={20} className="mr-2" />
        Add New Room
      </Button>

      {status === "pending" && (
        <div className="w-full flex justify-center items-center mt-4">
          <MoonLoader size={15} />
        </div>
      )}
      {roomsData?.length === 0 ? (
        <p className="text-center text-gray-500 mt-4 text-sm">
          No rooms added for this listing yet.
        </p>
      ) : (
        <div className="space-y-6 max-h-80 overflow-y-auto pr-2 pt-6">
          {roomsData?.map((room, index) => {
            const roomNumber = index + 1;
            const studentsLeft = room.max_occupants - room.current_occupants;
            const roomStatus = room.is_full
              ? "Occupied"
              : `${studentsLeft} student${studentsLeft > 1 ? "s" : ""} left`;

            return (
              <div
                key={room.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white shadow-sm relative "
              >
                <div
                  className={cn(
                    "absolute -top-4 left-2 text-xs text-white border border-b-0 border-gray-300 rounded-t-lg px-2",
                    roomStatus !== "Occupied" ? "bg-amber-300" : "bg-green-500"
                  )}
                >
                  {roomStatus}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Room {roomNumber}
                  </p>
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
            );
          })}
        </div>
      )}
    </>
  );

  const renderOperationView = () => {
    switch (operation) {
      case "add":
        return <AddNewRoom dismissDialogOnAction={dismissDialogOnAction} />;
      case "edit":
        return (
          <EditExistingRoom dismissDialogOnAction={dismissDialogOnAction} />
        );
      case "delete":
        return (
          <DeleteExistingRoom dismissDialogOnAction={dismissDialogOnAction} />
        );
      default:
        return renderRoomList();
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

export default RoomsDialogContent;
