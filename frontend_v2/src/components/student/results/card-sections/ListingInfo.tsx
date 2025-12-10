import StatsGrid from "./StatsGrid";
import AmenitiesSection from "./AmenitiesSection";
import PriceSection from "./PriceSection";
import { cn } from "@/lib/utils";

interface ListingInfoProps {
  listing: Listing;
  isAmenitiesExpanded: boolean;
  onToggleAmenities: () => void;
  onExpressInterest: (e: React.MouseEvent) => void;
  isFullyBooked: boolean;
}

export default function ListingInfo({
  listing,
  isAmenitiesExpanded,
  onToggleAmenities,
  onExpressInterest,
  isFullyBooked,
}: ListingInfoProps) {
  // console.log(listing);
  return (
    <div
      className={cn(
        "p-5 pt-6 flex flex-col gap-6 flex-1",
        isFullyBooked && "opacity-60 bg-slate-50 dark:bg-slate-900/50"
      )}
    >
      <StatsGrid
        roomsCount={listing.rooms.length}
        distanceFromCampus={parseInt(listing.distance_from_campus)}
        isFullyBooked={isFullyBooked}
      />

      <AmenitiesSection
        listingAmenities={listing.amenities}
        isExpanded={isAmenitiesExpanded}
        onToggle={onToggleAmenities}
      />

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-auto" />

      <PriceSection onExpressInterest={onExpressInterest} listing={listing} />
    </div>
  );
}
