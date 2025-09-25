import { CheckCircleIcon, RemoveCircleIcon } from "./icons";

interface RoomCardProps {
  room: Room;
  listingTitle: string;
  onClick: (room: Room) => void;
}

export const RoomCard = ({ room, listingTitle, onClick }: RoomCardProps) => {
  const studentsLeft = room.max_occupants - room.current_occupants;
  const statusInfo =
    room.is_full === true
      ? {
          text: "Occupied",
          color: "bg-green-500",
          icon: <CheckCircleIcon className="text-white w-6 h-6" />,
        }
      : {
          text: `${studentsLeft} student${studentsLeft > 1 ? "s" : ""} left`,
          color: "bg-yellow-500",
          icon: <RemoveCircleIcon className="text-white w-6 h-6" />,
        };

  return (
    <div
      onClick={() => onClick(room)}
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
        w-[340px] sm:w-[280px] lg:w-[250px]
        transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:scale-105
        ${
          room.is_full
            ? "border-l-4 border-green-500"
            : "border-l-4 border-yellow-500"
        }
      `}
    >
      <div
        className={`${statusInfo.color} p-4 flex items-center justify-between`}
      >
        <h2 className="text-xl font-bold text-white">
          Room {room.room_number}
        </h2>
        {statusInfo.icon}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Rent:
          </span>
          <span className="text-md font-semibold">{room.rent_per_month}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Status:
          </span>
          <span className="text-lg font-semibold">{statusInfo.text}</span>
        </div>
      </div>
    </div>
  );
};
