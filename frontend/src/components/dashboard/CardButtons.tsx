import { Bed, Edit, ImageIcon, List, Trash2 } from "lucide-react";
import { useAmenitiesDialogState, useSelectedAmenities } from "./listings/AmenitiesDialog";
import createEntityStore from "@/lib/store/entityStore";
import { useRoomsDialogState } from "./listings/RoomsDialog";


type Props = {
  listing: Listing
}

export const useSelectedListing = createEntityStore<Listing | null>(null);

function CardButtons({listing}: Props) {
  const { setEntities: setAmenitiesDialog } = useAmenitiesDialogState();
  const { setEntities: setSelectedAmenities } = useSelectedAmenities();
  const { setEntities: setSelectedListing } = useSelectedListing();
  const { setEntities: setRoomsDialog } = useRoomsDialogState();
  
  return (
    <div className="grid grid-cols-2">
      <button
        className="h-10 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1 transition-colors duration-200"
      >
        <Edit size={16} /> Edit
      </button>
      <button
        className="h-10 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-1 transition-colors duration-200"
        onClick={() => {
          setRoomsDialog(true);
          setSelectedListing(listing);
        }}
      >
        <Bed size={16} /> Rooms ({listing.rooms.length})
      </button>
      <button
        className="h-10 text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-1 transition-colors duration-200"
      >
        <ImageIcon size={16} /> Images ({listing.images.length})
      </button>
      <button
        className="h-10 text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-1 transition-colors duration-200"
        onClick={() => {
          setSelectedAmenities(listing.amenities.map(({amenity}) => amenity));
          setSelectedListing(listing);
          setAmenitiesDialog(true);
        }}
      >
        <List size={16} /> Amenities
      </button>
      <button
        className="col-span-2 rounded-b-lg h-10 text-sm font-medium bg-rose-500 hover:bg-red-600 text-white flex items-center justify-center gap-1 transition-colors duration-200"
      >
        <Trash2 size={16} /> Delete Listing
      </button>
    </div>
  )
}

export default CardButtons