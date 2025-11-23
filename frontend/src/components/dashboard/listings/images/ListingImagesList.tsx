"use client";
import { Button } from "@/components/ui/button";
import {
  useListingImageDialogMode,
  useSelectedListing,
  useSelectedListingImage,
} from "@/lib/hooks/store";
import { PlusCircle } from "lucide-react";
import { MoonLoader } from "react-spinners";
import { ListingImageCard } from "./ListingImageCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/services/api/config";
import { toast } from "sonner";
import axios from "axios";

function ListingImagesList() {
  const { entities: operation, setEntities: setOperation } =
    useListingImageDialogMode();
  const {
    entities: selectedListingImage,
    setEntities: setSelectedListingImage,
  } = useSelectedListingImage();
  const { entities: selectedListing } = useSelectedListing();

  const { data: imagesRes, status } = useQuery({
    queryKey: ["images", selectedListing?.id],
    queryFn: () =>
      axiosInstance.get(
        `/listings/listing-images/?listing=${selectedListing?.id}`
      ),
    enabled: !!selectedListing?.id,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      axios.patch(`/server/api/landlord-listings/images/${id}`, {
        is_face_image: true,
      }),
    onSuccess: () => {
      setOperation("list");
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["images", selectedListing?.id],
      });
      toast.success("Image was selected successfully.");
    },
  });

  const images: Image[] = imagesRes?.data;

  function onDelete(id: string) {
    const targetImage = images?.find((i) => i.id === id);

    // Guard clause: If image isn't found, stop here.
    if (!targetImage) return;

    setOperation("delete");
    setSelectedListingImage(targetImage);
  }

  async function onSelectFace(id: string) {
    const targetImage = images?.find((i) => i.id === id);

    // Guard clause
    if (!targetImage) return;

    setSelectedListingImage(targetImage);
    await mutation.mutate(id);
  }

  return (
    <div>
      <Button className="w-full" onClick={() => setOperation("add")}>
        <PlusCircle size={20} className="mr-2" />
        Add New Image
      </Button>

      {status === "pending" && (
        <div className="w-full flex justify-center items-center mt-4">
          <MoonLoader size={15} />
        </div>
      )}

      {images?.length === 0 ? (
        <p className="text-center text-gray-500 mt-4 text-sm">
          No images added for this listing yet.
        </p>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto items-center place-items-center pr-2 mt-4 grid">
          {images?.map((image) => (
            <ListingImageCard
              key={image.id}
              image={image}
              onDelete={(id: string) => onDelete(id)}
              onSelectFace={(id: string) => onSelectFace(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListingImagesList;
