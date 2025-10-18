import { Button } from "@/components/ui/button";
import {
  useActiveListing,
  useListingDialogMode,
  useListingDialogState,
} from "@/lib/hooks/store";
import { useEffect } from "react";
import Link from "next/link";
import HeaderButton from "../HeaderButton";

type Props = {
  listings: Listing[];
};

function ListingNavigation({ listings }: Props) {
  const { entities: activeListing, setEntities: setActiveListing } =
    useActiveListing();
  const { setEntities: setListingDialogOperation } = useListingDialogMode();
  const { setEntities: setDialog } = useListingDialogState();

  const handleListingChange = (listing: Listing) => {
    setActiveListing(listing);
  };

  useEffect(() => {
    if (listings.length > 0 && !activeListing.id) {
      handleListingChange(listings[0]);
    }
  }, [listings]);

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="text-gray-500 text-center">You have 0 listings.</div>
        <HeaderButton
          onClick={() => {
            setListingDialogOperation("add");
            setDialog(true);
          }}
        >
          <Link href="/dashboard/listings">Create a listing</Link>
        </HeaderButton>
      </div>
    );
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
