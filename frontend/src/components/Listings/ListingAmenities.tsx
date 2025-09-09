import fetchAmenities from "@/lib/services/api/fetchAmenities";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

type Props = {
  amenities: Amenity[];
};

function ListingAmenities({ amenities }: Props) {
  const { data: amenitiesMasterList } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => fetchAmenities({ params: { has_listings: true } }),
  });

  const searchedAmenities = (useSearchParams().get("amenities") || "")
    .split(",")
    .filter(Boolean);

  // Amenities that are in the listing and in the search
  const matchedAmenities = amenities.filter((amenity) =>
    searchedAmenities.includes(amenity.name.toString())
  );

  // Amenities that are in the search but not in the listing
  const missingAmenities = searchedAmenities
    .filter(
      (searched) =>
        searched &&
        !amenities.some((amenity) => amenity.name.toString() === searched)
    )
    .map((name) => {
      // Try to find the amenity in the master list to get the proper display name
      const masterAmenity = amenitiesMasterList?.find(
        (a: Amenity) => a.name.toString() === name
      );
      return {
        id: `missing-${name}`,
        name,
        display_name: masterAmenity?.display_name || name,
      };
    });

  // Amenities that are not in the search
  const extraAmenities = amenities.filter(
    (amenity) => !searchedAmenities.includes(amenity.name.toString())
  );

  return (
    <Fragment>
      {matchedAmenities.map((amenity) => (
        <span
          key={amenity.id}
          className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          {amenity.display_name}
        </span>
      ))}
      {missingAmenities.map((amenity) => (
        <span
          key={amenity.id}
          className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          {amenity.display_name}
        </span>
      ))}
      {extraAmenities.map((amenity) => (
        <span
          key={amenity.id}
          className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          {amenity.display_name}
        </span>
      ))}
    </Fragment>
  );
}

export default ListingAmenities;
