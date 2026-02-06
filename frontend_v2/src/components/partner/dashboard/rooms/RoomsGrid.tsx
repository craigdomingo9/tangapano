import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import React, { useEffect } from "react";
import RoomsEmptyState from "./RoomsEmptyState";
import RoomsPaginationControls from "./RoomsPaginationControls";
import { useEditingRoom } from "../pages/RoomManagement";

interface RoomsGridProps {
  listing: Listing;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ITEMS_PER_PAGE = 6;

function RoomsGrid({ listing, setIsModalOpen }: RoomsGridProps) {
  const rooms = listing.rooms || [];
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);

  const { setEntities: setEditingRoom } = useEditingRoom();

  const paginatedRooms = rooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Ensure current page is valid if items are deleted
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [rooms.length, totalPages, currentPage]);

  const handleAddRoom = () => {
    const newRoom = {
      max_occupants: 2,
      current_occupants: 0,
      gender_preference: "any",
      rent_per_month: "100",
      listing: parseInt(listing.id),
      room_name: null,
      room_number: rooms.length + 1,
    } as Room;
    setEditingRoom(newRoom);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom({
      max_occupants: room.max_occupants,
      current_occupants: room.current_occupants,
      gender_preference: room.gender_preference,
      rent_per_month: room.rent_per_month,
      listing: parseInt(listing.id),
      id: room.id,
      room_name: room.room_name,
      room_number: room.room_number,
    } as Room);
    setIsModalOpen(true);
  };

  if (!rooms.length) {
    return <RoomsEmptyState rooms={rooms} handleAddRoom={handleAddRoom} />;
  }

  // console.log(rooms);
  return (
    <>
      <div
        key={currentPage}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-100 content-start animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
      >
        {paginatedRooms.map((room) => {
          const isFull = room.current_occupants >= room.max_occupants;
          const isRevenueGenerating = room.current_occupants > 0;
          const genderMapping = {
            any: "Male / Female",
            male: "Male Only",
            female: "Female Only",
          };
          const roomTitle = room.room_name || `Room ${room.room_number}`;

          return (
            <div
              key={room.id}
              onClick={() => handleEditRoom(room)}
              className="group/card bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-lapis/50 dark:hover:border-sky-500/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col relative overflow-hidden"
            >
              {/* Minimal Top Stripe for status */}
              <div
                className={cn(
                  "h-1 w-full",
                  isFull
                    ? "bg-emerald-500"
                    : isRevenueGenerating
                      ? "bg-emerald-500"
                      : "bg-amber-400",
                )}
              />

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">
                      {roomTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {genderMapping[room.gender_preference]}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[0.62rem] sm:text-xs font-bold uppercase tracking-wide border",
                      isFull
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800",
                    )}
                  >
                    {isFull ? "Occupied" : "Available"}
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xxs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Rent
                      </p>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-200 tabular-nums">
                        ${room.rent_per_month}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xxs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Occupancy
                      </p>
                      <p className="text-xsm font-semibold text-slate-700 dark:text-slate-300">
                        <span
                          className={
                            isFull
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }
                        >
                          {room.current_occupants}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600">
                          /{room.max_occupants}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
                  <Edit className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <RoomsPaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
      />
    </>
  );
}

export default RoomsGrid;
