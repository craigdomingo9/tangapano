import { RoomCard } from "./RoomCard";

interface RoomsGridProps {
  rooms: Room[];
  listingTitle: string;
  onRoomClick: (room: Room) => void;
}

export const RoomsGrid = ({
  rooms,
  listingTitle,
  onRoomClick,
}: RoomsGridProps) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 text-sm">
          No rooms available for this listing.
          <br />
          Add some rooms to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:h-[350px] md:h-[500px] lg:grid-cols-3 lg:h-[350px] place-items-center gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          listingTitle={listingTitle}
          onClick={onRoomClick}
        />
      ))}
    </div>
  );
};
