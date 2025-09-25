import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import {
  useListingImageDialogMode,
  useSelectedListing,
  useSelectedListingImage,
} from "@/lib/hooks/store";

function DeleteExistingListingImage() {
  const { setEntities: setOperation } = useListingImageDialogMode();
  const { entities: selectedListing } = useSelectedListing();
  const { entities: selectedListingImage } = useSelectedListingImage();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      axios.delete(
        `/server/api/landlord-listings/images/${selectedListingImage.id}`
      ),
    onSuccess: () => {
      setOperation("list");
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["images", selectedListing?.id],
      });
      toast.success("Image was deleted successfully.");
    },
  });

  async function handleDeleteImage() {
    await mutation.mutateAsync();
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-gray-800 font-semibold text-center text-sm">
        Are you sure you want to delete this image?
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setOperation("list")}>Cancel</Button>
        <Button
          variant={"destructive"}
          disabled={mutation.isPending}
          onClick={handleDeleteImage}
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

export default DeleteExistingListingImage;
