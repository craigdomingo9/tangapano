import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { ShareDialog } from "./ShareDialog";
import ImageCarousel from "./card-sections/ImageCarousel";
import ListingInfo from "./card-sections/ListingInfo";
import MapToggleButton from "./buttons/MapToggleButton";
import { Globe, Layers, Maximize, X } from "lucide-react";
import { LazyMapWrapper } from "@/components/common/maps/LazyMapWrapper";
import { Button } from "@/components/ui/button";
import FullScreenListingMap from "../../common/maps/FullScreenListingMap";

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
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const hasLocation = !(
    !listing.location ||
    !listing.location.lat ||
    !listing.location.lon ||
    !listing.campus_location ||
    !listing.campus_location.lat ||
    !listing.campus_location.lon
  );

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
            <LazyMapWrapper listing={listing} />
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

          {hasLocation && (
            <MapToggleButton showMap={showMap} setShowMap={setShowMap} />
          )}
          {showMap && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMapFullscreen(true);
                }}
                className="absolute cursor-pointer top-2 right-2 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-lg text-slate-600 dark:text-slate-300 shadow-sm hover:scale-110 transition-transform hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                title="Maximize Map"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </>
          )}
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

      {/* Fullscreen Map Modal */}
      {isMapFullscreen && hasLocation && (
        <FullScreenListingMap
          listing={listing}
          turnFullScreenOff={() => setIsMapFullscreen(false)}
        />
      )}

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        listing={listing}
      />
    </>
  );
}
