import { cn } from "@/lib/utils";
import { Info, Minus, Plus, X } from "lucide-react";
import { useEditingRoom } from "../pages/RoomManagement";
import { infoToast } from "@/lib/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomEditorModalProps {
  onClose: () => void;
  onSave: (room: Room) => void;
}

function RoomEditorModal({ onClose, onSave }: RoomEditorModalProps) {
  const { entities: room, setEntities: setEditingRoom } = useEditingRoom();
  const isAnyDisabled = room.current_occupants > 0;

  const updateField = (field: keyof Room, value: any) => {
    // RULE: Cannot set gender to 'any' if room is occupied
    if (field === "gender_preference" && value === "any") {
      if (room.current_occupants > 0) {
        infoToast("Gender can only be 'Any' if the room is empty.");
        return; // Block update
      }
    }

    setEditingRoom({ ...room, [field]: value });
  };

  const incrementRent = (amount: number) => {
    const newVal = Math.max(0, parseInt(room.rent_per_month) + amount);

    updateField("rent_per_month", newVal);
  };

  const incrementMaxOccupants = (amount: number) => {
    const newVal = Math.max(0, (room.max_occupants as number) + amount);

    if (newVal < room.current_occupants) {
      infoToast("Capacity cannot be less than current occupants.");
      return;
    }

    updateField("max_occupants", newVal);
  };

  const incrementCurrentOccupants = (amount: number) => {
    const newVal = Math.max(0, (room.current_occupants as number) + amount);

    if (newVal > room.max_occupants) {
      infoToast("Occupants cannot be greater than capacity.");
      return;
    }

    // 2. Logic: First Occupant Rule (0 -> 1)
    // If we are adding the first person and gender is still "Any",
    // we must lock it to a specific gender.
    if (
      room.current_occupants === 0 &&
      newVal === 1 &&
      room.gender_preference === "any"
    ) {
      setEditingRoom({
        ...room,
        current_occupants: newVal,
        gender_preference: "male",
      });

      return;
    }

    updateField("current_occupants", newVal);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-8 pb-4 px-6 text-center border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {room.id ? "Edit" : "Add"} Room
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xsm ">
            {room.id ? "Update" : "Add"} room details and occupancy.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Monthly Rent */}
          <div className="space-y-2">
            <label className="text-xsm font-semibold text-slate-700 dark:text-slate-300">
              Monthly Rent ($)
            </label>
            <div className="flex items-center h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-1 focus-within:ring-lapis dark:focus-within:ring-sky-500 focus-within:border-lapis dark:focus-within:border-sky-500 mt-1">
              <button
                onClick={() => incrementRent(-5)}
                className="h-full px-5 bg-slate-200 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center  disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 cursor-pointer"
                disabled={parseInt(room.rent_per_month) <= 5}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="h-full flex-1 flex items-center justify-center bg-white dark:bg-slate-900 text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {parseFloat(room.rent_per_month).toFixed(2)}
              </div>
              <button
                onClick={() => incrementRent(5)}
                className="h-full px-5 bg-slate-200 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border-l border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <label className="text-xsm font-semibold text-slate-700 dark:text-slate-300">
              Allowed Gender
            </label>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <label
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-3 rounded-lg border cursor-pointer transition-all",
                  room.gender_preference === "male"
                    ? "border-lapis dark:border-sky-500 bg-lapis/5 dark:bg-sky-500/10 text-lapis dark:text-sky-400 ring-1 ring-lapis dark:ring-sky-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                )}
              >
                <input
                  type="radio"
                  name="gender"
                  className="hidden"
                  checked={room.gender_preference === "male"}
                  onChange={() => updateField("gender_preference", "male")}
                />
                <span className="font-semibold text-xsm">Male</span>
              </label>
              <label
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-3 rounded-lg border cursor-pointer transition-all",
                  room.gender_preference === "female"
                    ? "border-lapis dark:border-sky-500 bg-lapis/5 dark:bg-sky-500/10 text-lapis dark:text-sky-400 ring-1 ring-lapis dark:ring-sky-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                )}
              >
                <input
                  type="radio"
                  name="gender"
                  className="hidden"
                  checked={room.gender_preference === "female"}
                  onChange={() => updateField("gender_preference", "female")}
                />
                <span className="font-semibold text-xsm">Female</span>
              </label>
              {/* Any Option (With Tooltip Logic) */}
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    {/* WRAPPER DIV: This captures the click/hover event.
                       We use cursor-not-allowed here so the user sees the 'ban' cursor.
                    */}
                    <div
                      className={cn(
                        "h-full",
                        isAnyDisabled && "cursor-not-allowed"
                      )}
                    >
                      <label
                        className={cn(
                          "flex h-full items-center justify-center gap-2 px-3 py-3 rounded-lg border transition-all",
                          room.gender_preference === "any"
                            ? "border-lapis dark:border-sky-500 bg-lapis/5 dark:bg-sky-500/10 text-lapis dark:text-sky-400 ring-1 ring-lapis dark:ring-sky-500"
                            : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",

                          // If NOT disabled, allow hover effects and pointer events
                          !isAnyDisabled &&
                            "cursor-pointer hover:border-slate-300 dark:hover:border-slate-600",

                          // If DISABLED: reduce opacity and KILL pointer events on the label
                          // This forces the click to pass through to the wrapper div (Trigger)
                          isAnyDisabled &&
                            "opacity-50 bg-slate-50 dark:bg-slate-800 pointer-events-none"
                        )}
                      >
                        <input
                          type="radio"
                          name="gender"
                          className="hidden"
                          checked={room.gender_preference === "any"}
                          onChange={() =>
                            updateField("gender_preference", "any")
                          }
                          disabled={isAnyDisabled}
                        />
                        <span className="font-semibold text-xsm">Any</span>
                      </label>
                    </div>
                  </TooltipTrigger>

                  {/* Only show content if disabled */}
                  {isAnyDisabled && (
                    <TooltipContent
                      side="top"
                      className="max-w-[200px] text-center bg-slate-900 text-white border-slate-800"
                    >
                      <p>
                        Room must be empty to set gender preference to 'Any'.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Help Text for Gender */}
            {room.gender_preference !== "any" && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                  <strong>Note:</strong> Only empty rooms can be set to "Any"
                  gender. If the room is occupied, it must be assigned a
                  specific gender to match the current tenants.
                </p>
              </div>
            )}
          </div>

          {/* Capacity Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Capacity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Capacity
              </label>
              <div className="flex items-center h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mt-1">
                <button
                  onClick={() => incrementMaxOccupants(-1)}
                  className="w-10 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 cursor-pointer"
                  disabled={room.max_occupants <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="flex-1 flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm">
                  {room.max_occupants}
                </div>
                <button
                  onClick={() => incrementMaxOccupants(1)}
                  className="w-10 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border-l border-slate-200 dark:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Occupied */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Occupied
              </label>
              <div className="flex items-center h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mt-1">
                <button
                  onClick={() => incrementCurrentOccupants(-1)}
                  className="w-10 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 cursor-pointer"
                  disabled={room.current_occupants <= 0}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="flex-1 flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm">
                  {room.current_occupants}
                </div>
                <button
                  onClick={() => incrementCurrentOccupants(1)}
                  className="w-10 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border-l border-slate-200 dark:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 justify-end border-t border-slate-50 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(room)}
              className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomEditorModal;
