import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { useListingDialogState, useSelectedListing } from "@/lib/hooks/store";

function DeleteExistingListing() {
  const { setEntities: setDialog } = useListingDialogState();
  const { entities: selectedListing } = useSelectedListing();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      axios.delete(`/server/api/landlord-listings/${selectedListing?.id}`),
    onSuccess: () => {
      setDialog(false);
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      toast.success("Listing was deleted successfully.");
    },
  });

  async function handleDeleteListing() {
    await mutation.mutateAsync();
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-gray-800 font-semibold text-center text-sm">
        Are you sure you want to delete this listing?
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setDialog(false)}>Cancel</Button>
        <Button variant={"destructive"} onClick={handleDeleteListing}>
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

export default DeleteExistingListing;
