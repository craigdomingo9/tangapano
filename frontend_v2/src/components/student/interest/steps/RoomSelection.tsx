import {
  ExpressInterestState,
  useExpressInterestStore,
} from "@/lib/stores/expressInterestStore";
import { cn } from "@/lib/utils";
import { Bed, Check } from "lucide-react";
import { useEffect } from "react";

interface RoomSelectionProps {
  listing: Listing;
  updateStore: (key: keyof ExpressInterestState, value: any) => void;
}

function RoomSelection({ listing, updateStore }: RoomSelectionProps) {
  const {
    entities: { selectedRoom },
  } = useExpressInterestStore();

  useEffect(() => {
    if (
      listing.rooms.length === 0 ||
      listing.rooms.find((room) => room.id === selectedRoom?.id)
    )
      return;

    updateStore("selectedRoom", listing.rooms[0]);
  }, [listing]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-4">
        <Bed className="text-orange-500 drop-shadow-md" size={24} />
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
          Select Your Preferred Room
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        {listing.rooms.map((room) => {
          const isFull = room.current_occupants >= room.max_occupants;
          const spotsOpen = room.max_occupants - room.current_occupants;
          const isSelected = selectedRoom?.id === room.id;

          return (
            <div
              key={room.id}
              onClick={() => !isFull && updateStore("selectedRoom", room)}
              className={`
                        relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group overflow-hidden
                        ${
                          isSelected
                            ? "bg-blue-50 dark:bg-slate-700/60 border-blue-500 dark:border-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5"
                            : "bg-white dark:bg-transparent border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/40"
                        }
                        ${
                          isFull
                            ? "opacity-60 cursor-not-allowed grayscale"
                            : ""
                        }
                    `}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1.5">
                  <h3
                    className={`text-base font-semibold transition-colors ${
                      isSelected
                        ? "text-blue-900 dark:text-white"
                        : "text-slate-900 dark:text-slate-200"
                    }`}
                  >
                    Room {room.room_number}
                  </h3>
                  <p
                    className={`text-xsm font-medium ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-200"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    ${parseInt(room.rent_per_month).toFixed(2)}/month
                  </p>
                  <div className="pt-2">
                    <span
                      className={`
                                    inline-flex items-center px-3 py-1.5 rounded-full text-xxs font-bold shadow-sm transition-transform group-hover:scale-105
                                    ${
                                      isFull
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                        : "bg-white text-slate-900"
                                    }
                                `}
                    >
                      {spotsOpen}/{room.max_occupants} spots open
                    </span>
                  </div>
                </div>

                <div className="mt-1">
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white dark:ring-blue-400 animate-in zoom-in duration-200">
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-300/20 border-2 border-slate-300 dark:border-transparent group-hover:border-slate-400 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomSelection;
