"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import DeleteExistingListingImage from "./DeleteExistingListingImage";
import AddNewListingImage from "./AddNewListingImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/services/api/config";
import { MoonLoader } from "react-spinners";
import {
  useListingImageDialogMode,
  useSelectedListing,
  useSelectedListingImage,
} from "@/lib/hooks/store";
import { ListingImageCard } from "./ListingImageCard";
import ListingImagesList from "./ListingImagesList";

function ListingImageDialogContent() {
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setSelectedListingImage } = useSelectedListingImage();
  const { entities: operation, setEntities: setOperation } =
    useListingImageDialogMode();

  const { data: imagesRes, status } = useQuery({
    queryKey: ["images", selectedListing?.id],
    queryFn: () =>
      axiosInstance.get(
        `/listings/listing-images/?listing=${selectedListing?.id}`
      ),
    enabled: !!selectedListing?.id,
  });

  const images: Image[] = imagesRes?.data;

  const renderRoomList = () => (
    <>
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
              onDelete={(id: string) => setOperation("delete")}
              onSelectFace={(id: string) => setSelectedListingImage(image)}
            />
          ))}
        </div>
      )}
    </>
  );

  const renderOperationView = () => {
    switch (operation) {
      case "add":
        return <AddNewListingImage />;
      case "delete":
        return <DeleteExistingListingImage />;
      default:
        return <ListingImagesList />;
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm relative">
        {renderOperationView()}
      </div>
    </div>
  );
}

export default ListingImageDialogContent;
