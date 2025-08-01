import { MapPin, Ruler } from "lucide-react";
import ListingImages from "../../Listings/ListingImages";
import { Card, CardContent, CardHeader } from "../../ui/card";
import CardButtons from "../CardButtons";

type Props = {
  listing: Listing;
};

function ListingCard({ listing }: Props) {
  return (
    <>
      <Card className="py-0 mx-2 h-[34rem] flex flex-col gap-0 cursor-pointer hover:scale-[1.025] transition border-0">
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
              {listing.neighborhood.name}, {listing.neighborhood.city}
            </p>
            <p className="text-gray-700 flex items-center mb-1">
              <Ruler size={16} className="mr-2 text-orange-500" />{" "}
              {listing.distance_from_campus} mins from campus
            </p>
            <div className="flex flex-wrap gap-1 my-2">
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
        {/* Action Buttons */}
        <CardButtons listing={listing} />
      </Card>
    </>
  );
}

export default ListingCard;
