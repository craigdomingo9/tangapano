import StatsGrid from "./StatsGrid";
import AmenitiesSection from "./AmenitiesSection";
import PriceSection from "./PriceSection";

interface ListingInfoProps {
  listing: Listing;
  isAmenitiesExpanded: boolean;
  onToggleAmenities: () => void;
  onExpressInterest: (e: React.MouseEvent) => void;
}

export default function ListingInfo({
  listing,
  isAmenitiesExpanded,
  onToggleAmenities,
  onExpressInterest,
}: ListingInfoProps) {
  return (
    <div className="p-5 pt-6 flex flex-col gap-6 flex-1">
      <StatsGrid
        roomsCount={listing.rooms.length}
        distanceFromCampus={parseInt(listing.distance_from_campus)}
      />

      <AmenitiesSection
        listingAmenities={listing.amenities}
        isExpanded={isAmenitiesExpanded}
        onToggle={onToggleAmenities}
      />

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-auto" />

      <PriceSection
        applyAgentFee={listing.apply_agent_fee}
        agentFee={parseFloat(listing.campus.agent.agent_fee)}
        onExpressInterest={onExpressInterest}
        listing={listing}
      />
    </div>
  );
}
