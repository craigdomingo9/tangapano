import { Button } from "@/components/ui/button"
import { useRoomsDialogOperation, useSelectedRoom } from "./RoomsDialogContent";
import { useState } from "react";
import { MoonLoader } from "react-spinners";


function DeleteExistingRoom() {

  const { entities: operation, setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedRoom } = useSelectedRoom();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteRoom() {
    setIsDeleting(true);
    console.log("Deleting room...", selectedRoom);
    // setOperation("list");

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
          {isDeleting ? (
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
