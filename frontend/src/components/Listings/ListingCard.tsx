import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import ListingImages from "./ListingImages";
import {
  Bed,
  DollarSign,
  MapPin,
  MessageCircle,
  Ruler,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  useContactAgentDialogState,
  useSelectedListingByStudent,
} from "./ContactAgentDialog";

type Props = {
  listing: Listing;
};

function ListingCard({ listing }: Props) {
  const { setEntities: setDialog } = useContactAgentDialogState();
  const { setEntities: setSelectedListing } = useSelectedListingByStudent();

  const [room, _] = useState(listing.rooms[0]);

  const roomPrices = listing.rooms.map((_room) =>
    parseFloat(_room.rent_per_month),
  );
  const minRoomPrice = roomPrices.reduce((prev, curr) =>
    Math.min(curr, prev || 0),
  );
  const maxRoomPrice = roomPrices.reduce((prev, curr) =>
    Math.max(curr, prev || 0),
  );
  // console.log(roomPrices, minRoomPrice, maxRoomPrice)

  const roomsPriceRange =
    minRoomPrice !== maxRoomPrice
      ? `$${minRoomPrice}-$${maxRoomPrice}/month`
      : `$${minRoomPrice}/month`;

  return (
    <Card className="py-0 mx-2 h-[34rem] flex flex-col gap-0 cursor-pointer hover:scale-[1.025] transition">
      <CardHeader className="px-0">
        <ListingImages listing={listing} />
      </CardHeader>
      <CardContent className="flex-1 px-3">
        <div className="[&>p]:text-sm">
          <h2 className="scroll-m-20 border-b pb-2 mb-2 text-lg font-semibold tracking-tight first:mt-0 truncate">
            {listing.title}
          </h2>
          <p className="text-gray-600 flex items-center mb-1">
            <MapPin size={16} className="mr-2 text-indigo-500" />{" "}
            {listing.neighborhood.name}
          </p>
          <p className="text-gray-700 flex items-center font-semibold mb-1">
            <DollarSign size={16} className="mr-2 text-green-600" />{" "}
            {roomsPriceRange} | ${listing.campus.agents.agent_fee} agent fee
          </p>
          <p className="text-gray-700 flex items-center mb-1">
            <Users size={16} className="mr-2 text-purple-500" />{" "}
            {room.max_occupants} student(s) per room
          </p>
          <p className="text-gray-700 flex items-center mb-1">
            <Bed size={16} className="mr-2 text-yellow-500" />{" "}
            {listing.rooms.length} room(s) available
          </p>
          <p className="text-gray-700 flex items-center mb-3">
            <Ruler size={16} className="mr-2 text-orange-500" />{" "}
            {listing.distance_from_campus} mins from campus
          </p>
          {/* <p className="text-gray-700 flex items-center mb-3">
            <Users size={16} className="mr-2 text-blue-500" /> Gender: {capitalizeFirstLetter(room.gender_preference)}
          </p> */}
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.amenities.map((amenity) => (
              <span
                key={amenity.id}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {amenity.display_name}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <>
        <Button
          className="w-full h-14 rounded-t-none cursor-pointer sm:hover:scale-[1.03] transition bg-af-blue"
          onClick={() => {
            setSelectedListing(listing);
            setDialog(true);
          }}
        >
          <MessageCircle size={20} />
          Contact Agent
        </Button>
      </>
    </Card>
  );
}

export default ListingCard;
