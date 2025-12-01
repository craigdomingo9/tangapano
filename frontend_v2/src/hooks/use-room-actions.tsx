import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomsApi as api } from "@/lib/api/rooms";
import { errorToast, successToast } from "@/lib/toast";

interface RoomActionsProps {
  accessToken?: string;
  listingId?: string;
}

// Define the arguments object for the update mutation
interface UpdateRoomArgs {
  roomId: string;
  data: Partial<Room>;
}

function useRoomActions(accessToken?: string, listingId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ["listing", listingId];

  // 1. CREATE ROOM
  const createRoom = useMutation({
    mutationFn: (data: Partial<Room>) => api.createRoom(data, accessToken!),

    // Server returns the created room (newRoom)
    onSuccess: (newRoom) => {
      successToast("Room created successfully");

      // MANUAL CACHE UPDATE: Add the new room to the list immediately
      queryClient.setQueryData(queryKey, (oldListing: any) => {
        if (!oldListing) return oldListing;
        return {
          ...oldListing,
          rooms: [...(oldListing.rooms || []), newRoom], // Append new room
        };
      });

      // Safety Refetch
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => {
      errorToast("Failed to create room");
    },
  });

  // 2. UPDATE ROOM
  const updateRoom = useMutation({
    // FIX: Wrap arguments in a single object ({ roomId, data })
    mutationFn: ({ roomId, data }: UpdateRoomArgs) =>
      api.updateRoom(roomId, data, accessToken!),

    // Server returns the updated room (updatedRoom)
    onSuccess: (updatedRoom) => {
      successToast("Room updated successfully");

      // MANUAL CACHE UPDATE: Find and replace the specific room
      queryClient.setQueryData(queryKey, (oldListing: any) => {
        if (!oldListing || !oldListing.rooms) return oldListing;

        return {
          ...oldListing,
          rooms: oldListing.rooms.map((room: Room) =>
            // @ts-ignore
            room.id === updatedRoom.id ? updatedRoom : room
          ),
        };
      });

      // Safety Refetch
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => {
      errorToast("Failed to update room");
    },
  });

  return {
    createRoom,
    updateRoom,
  };
}

export default useRoomActions;
