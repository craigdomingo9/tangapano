import { Button } from "@/components/ui/button"
import { useRoomsDialogOperation, useSelectedRoom } from "./RoomsDialogContent";
import { MoonLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelectedListing } from "../CardButtons";


function DeleteExistingRoom() {
  
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedRoom } = useSelectedRoom();
  
  const queryClient = useQueryClient(); 
  const mutation = useMutation({
    mutationFn: () => axios.delete(`/api/landlord-listings/rooms/${selectedRoom?.id}`),
    onSuccess: () => {
      setOperation("list");
      queryClient.invalidateQueries({queryKey: ["landlord-listings"]});
      queryClient.invalidateQueries({queryKey: ["rooms", selectedListing?.id]});
    },
  })

  async function handleDeleteRoom() {
    await mutation.mutateAsync();    
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-gray-800">Are you sure you want to delete this room?</p>
      <div className="flex gap-2">
        <Button onClick={() => setOperation("list")}>Cancel</Button>
        <Button 
          variant={"destructive"}
          onClick={handleDeleteRoom}
        >
          {mutation.isPending ? (
            <MoonLoader
              color="white"
              size={15}
            />
          ) : "Delete"}
        </Button>
      </div>
    </div>
  )
}

export default DeleteExistingRoom
