import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  useActiveListing,
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
  useSelectedRoom,
} from "@/lib/hooks/store";

const CheckCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const RemoveCircleIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
  </svg>
);

function ListingRooms() {
  const { entities: activeListing } = useActiveListing();
  const { setEntities: setRoomsDialog } = useRoomsDialogState();
  const { setEntities: setSelectedListing } = useSelectedListing();
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { setEntities: setSelectedRoom } = useSelectedRoom();

  const { data, status } = useQuery({
    queryKey: ["rooms", activeListing?.id],
    queryFn: () =>
      axios.get(`/server/api/landlord-listings/${activeListing?.id}/rooms`),
    enabled: !!activeListing?.id,
  });

  if (!activeListing.rooms) {
    return null;
  }

  const rooms = data?.data || [];

  return (
    <div className="mb-5">
      <main>
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
          {activeListing.title} - Rooms
          <p className="text-sm text-gray-500 mb-2">
            Click a room to view details
          </p>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: Room, indx: number) => {
            const studentsLeft = room.max_occupants - room.current_occupants;
            const statusInfo =
              room.is_full === true
                ? {
                    text: "Occupied",
                    color: "bg-green-500",
                    icon: <CheckCircleIcon className="text-white w-6 h-6" />,
                  }
                : {
                    text: `${studentsLeft} student${
                      studentsLeft > 1 ? "s" : ""
                    } left`,
                    color: "bg-yellow-500",
                    icon: <RemoveCircleIcon className="text-white w-6 h-6" />,
                  };
            return (
              <div
                key={room.id}
                onClick={() => {
                  setSelectedListing(activeListing);
                  setRoomsDialog(true);
                  setSelectedRoom(room);
                  setOperation("edit");
                }}
                className={`
                    bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
                    transition-all duration-300
                    hover:shadow-xl hover:scale-105
                    ${
                      room.is_full
                        ? "border-l-4 border-green-500"
                        : "border-l-4 border-yellow-500"
                    }
                  `}
              >
                {/* Status header with dynamic color */}
                <div
                  className={`${statusInfo.color} p-4 flex items-center justify-between`}
                >
                  <h2 className="text-xl font-bold text-white">
                    Room {indx + 1}
                  </h2>
                  {statusInfo.icon}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rent:
                    </span>
                    <span className="text-md font-semibold">
                      {room.rent_per_month}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status:
                    </span>
                    <span className="text-lg font-semibold">
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default ListingRooms;
