import { useActiveListing } from "@/app/dashboard/rooms/page";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type Props = {
  listings: Listing[];
};

function ListingNavigation({ listings }: Props) {
  const { entities: activeListing, setEntities: setActiveListing } =
    useActiveListing();

  const handleListingChange = (listing: Listing) => {
    setActiveListing(listing);
  };

  useEffect(() => {
    if (listings.length > 0 && !activeListing.id) {
      handleListingChange(listings[0]);
    }
  }, [listings]);

  if (listings.length === 0) {
    return <div className="text-gray-500">No rooms available yet.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {listings.length > 0 &&
        listings?.map((listing) => (
          <Button
            key={listing.id}
            onClick={() => handleListingChange(listing)}
            className={`
                px-4 py-2 rounded-full font-semibold transition duration-300
                ${
                  activeListing.id === listing.id
                    ? "bg-[var(--lapis-lazuli)] text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }
              `}
          >
            {listing.title}
          </Button>
        ))}
    </div>
  );
}

export default ListingNavigation;
