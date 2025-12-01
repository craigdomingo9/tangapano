import { Edit, Plus } from "lucide-react";
import React from "react";
import { useEditingRoom } from "../pages/RoomManagement";

interface RoomsHeaderAreaProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  listingId: string;
}

function RoomsHeaderArea({ setModalOpen, listingId }: RoomsHeaderAreaProps) {
  const { setEntities: setEditingRoom } = useEditingRoom();

  const handleAddRoom = () => {
    setEditingRoom({
      max_occupants: 2,
      current_occupants: 0,
      gender_preference: "any",
      rent_per_month: "100",
      listing: parseInt(listingId),
    } as Room);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Rooms
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xsm sm:text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          Click on a card to edit room details
        </p>
      </div>
      <button
        onClick={handleAddRoom}
        className="bg-lapis cursor-pointer text-sm hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm flex items-center gap-2 transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>Add Room</span>
      </button>
    </div>
  );
}

export default RoomsHeaderArea;
