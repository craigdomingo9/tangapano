import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StepProps } from "@/lib/types/express-interest";
import {
  useExpressInterestDialogState,
  useSelectedListingByStudent,
} from "@/lib/hooks/store";
import { useEffect } from "react";

/**
 * First step: Room selection from available rooms in the listing
 */
export const RoomSelectionStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
}) => {
  const { entities: selectedListing } = useSelectedListingByStudent();
  const { entities: isDialogOpen } = useExpressInterestDialogState();

  const rooms = selectedListing?.rooms || [];

  const canProceed = Boolean(formData.selectedRoomId);

  const handleRoomSelect = (roomId: string) => {
    onUpdate({ selectedRoomId: roomId });
  };

  const getSpotsLeft = (room: any) => {
    const spotsLeft = room.max_occupants - room.current_occupants;
    return `${spotsLeft}/${room.max_occupants} spots open`;
  };

  useEffect(() => {
    if (!isDialogOpen || !rooms.length) return;

    onUpdate({ selectedRoomId: rooms[0].id });
  }, [isDialogOpen]);

  return (
    <div className="space-y-3" data-testid="room-selection-step">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-start">
          🏠 Select Your Preferred Room
        </h3>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
            {rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No rooms available in this listing
              </div>
            ) : (
              rooms.map((room) => {
                const isSelected =
                  formData.selectedRoomId === room.id &&
                  formData.selectedRoomId !== null;

                return (
                  <div
                    key={room.id}
                    className={cn(
                      "flex items-center cursor-pointer justify-between p-4 transition-all rounded-lg border-2 max-h-20",
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => handleRoomSelect(room.id)}
                    data-testid={`room-option-${room.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Room {room.room_number}
                      </p>
                      <p className="text-gray-600 text-sm">
                        ${parseFloat(room.rent_per_month).toFixed(2)}/month
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {getSpotsLeft(room)}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center w-full pt-0">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="min-w-24 w-full bg-af-blue h-12"
          data-testid="next-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
