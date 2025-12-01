import { DoorOpen } from "lucide-react";

interface RoomsEmptyStateProps {
  rooms: Room[];
  handleAddRoom: () => void;
}

function RoomsEmptyState({ rooms, handleAddRoom }: RoomsEmptyStateProps) {
  return (
    <>
      {rooms.length === 0 && (
        <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-200 dark:border-slate-700">
            <DoorOpen className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No rooms added yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm text-center text-xsm">
            Add rooms to track occupancy and details.
          </p>
          <button
            onClick={handleAddRoom}
            className="px-5 py-2.5 bg-lapis dark:bg-sky-600 text-white font-semibold rounded-lg hover:bg-lapis-hover dark:hover:bg-sky-500 transition-all shadow-sm text-xsm cursor-pointer"
          >
            Create First Room
          </button>
        </div>
      )}
    </>
  );
}

export default RoomsEmptyState;
