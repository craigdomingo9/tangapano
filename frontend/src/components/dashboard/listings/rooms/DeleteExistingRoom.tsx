import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
  useSelectedRoom,
} from "@/lib/hooks/store";

type Props = {
  dismissDialogOnAction?: boolean;
};

function DeleteExistingRoom({ dismissDialogOnAction }: Props) {
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { entities: selectedRoom } = useSelectedRoom();
  const { setEntities: setDialog } = useRoomsDialogState();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      axios.delete(`/server/api/landlord-listings/rooms/${selectedRoom?.id}`),
    onSuccess: () => {
      toast.success("Room was deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["rooms", selectedListing?.id],
      });

      if (dismissDialogOnAction) {
        setDialog(false);
        return;
      }

      setOperation("list");
    },
  });

  async function handleDeleteRoom() {
    await mutation.mutateAsync();
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-gray-800 font-semibold text-center text-sm">
        Are you sure you want to delete this room?
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setOperation("list")}>Cancel</Button>
        <Button
          variant={"destructive"}
          disabled={mutation.isPending}
          onClick={handleDeleteRoom}
        >
          {mutation.isPending ? (
            <MoonLoader color="white" size={15} />
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </div>
  );
}

export default DeleteExistingRoom;
