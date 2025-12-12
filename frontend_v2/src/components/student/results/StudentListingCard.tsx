import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { ShareDialog } from "./ShareDialog";
import ImageCarousel from "./card-sections/ImageCarousel";
import ListingInfo from "./card-sections/ListingInfo";
import MapView from "./card-sections/MapView";
import MapToggleButton from "./MapToggleButton";

interface StudentListingCardProps {
  listing: Listing;
  onExpressInterest: (listingId: string) => void;
}

export function StudentListingCard({
  listing,
  onExpressInterest,
}: StudentListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleExpressInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullyBooked) {
      onExpressInterest(listing.id);
    }
  };

  const isFullyBooked = useMemo(() => {
    if (listing.rooms.length === 0) return false;
    const totalCapacity = listing.rooms.reduce(
      (acc, r) => acc + r.max_occupants,
      0
    );
    const totalOccupied = listing.rooms.reduce(
      (acc, r) => acc + r.current_occupants,
      0
    );
    return totalOccupied >= totalCapacity;
  }, [listing.rooms]);

  return (
    <>
      <div
        className={cn(
          "group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col h-full",
          !isFullyBooked && "hover:shadow-md"
        )}
      >
        <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {showMap ? (
            <MapView listing={listing} />
          ) : (
            <ImageCarousel
              listing={listing}
              title={listing.title}
              showMap={showMap}
              setShowMap={(state: boolean) => setShowMap(state)}
              neighborhood={listing.neighborhood.name}
              currentImageIndex={currentImageIndex}
              onNextImage={() =>
                setCurrentImageIndex(
                  (prev) => (prev + 1) % listing.images.length
                )
              }
              onPrevImage={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? listing.images.length - 1 : prev - 1
                )
              }
              onShare={() => setIsShareOpen(true)}
              isFullyBooked={isFullyBooked}
            />
          )}
          {/* Map Toggle Button - Bottom Right */}
          <MapToggleButton showMap={showMap} setShowMap={setShowMap} />
        </div>

        {/* Listing Info Section */}
        <ListingInfo
          listing={listing}
          isAmenitiesExpanded={isAmenitiesExpanded}
          onToggleAmenities={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
          onExpressInterest={handleExpressInterestClick}
          isFullyBooked={isFullyBooked}
        />
      </div>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        listing={listing}
      />
    </>
  );
}
