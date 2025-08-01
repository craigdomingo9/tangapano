import { Button } from "@/components/ui/button";
import { useSelectedListing } from "../../CardButtons";
import { useListingImageDialogOperation } from "./ListingImageDialog";
import { PlusCircle, Trash2 } from "lucide-react";
import DeleteExistingListingImage from "./DeleteExistingListingImage";
import AddNewListingImage from "./AddNewListingImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import createEntityStore from "@/lib/store/entityStore";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/services/api/config";
import { MoonLoader } from "react-spinners";

export const useSelectedListingImage = createEntityStore<Image>({} as Image);

function ListingImageDialogContent() {
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setSelectedListingImage } = useSelectedListingImage();
  const { entities: operation, setEntities: setOperation } =
    useListingImageDialogOperation();

  const { data: imagesRes, status } = useQuery({
    queryKey: ["images", selectedListing?.id],
    queryFn: () =>
      axiosInstance.get(
        `/listings/listing-images/?listing=${selectedListing?.id}`,
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
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mt-4 grid sm:grid-cols-2">
          {images?.map((image) => (
            <div
              key={image.id}
              className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-sm sm:max-w-48"
            >
              <Avatar className="w-full h-32 rounded-none">
                <AvatarImage src={image.image} />
                <AvatarFallback className="rounded-md">
                  {selectedListing.title}
                </AvatarFallback>
              </Avatar>
              {image.caption && (
                <p className="absolute bottom-0 left-0 right-0 bg-gray-500 text-white text-xs p-1 text-center">
                  {image.caption}
                </p>
              )}
              <button
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-100 transition-opacity duration-200"
                title="Delete Image"
                onClick={() => {
                  setOperation("delete");
                  setSelectedListingImage(image);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
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
        return renderRoomList();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg relative">
      {renderOperationView()}
    </div>
  );
}

export default ListingImageDialogContent;
