import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Image,
  Link,
  MapPin,
  Share2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { ShareDialog } from "./ShareDialog";
import ImageCarousel from "./card-sections/ImageCarousel";
import ListingInfo from "./card-sections/ListingInfo";

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
        {/* Image Carousel Section */}
        <ImageCarousel
          listing={listing}
          title={listing.title}
          neighborhood={listing.neighborhood.name}
          currentImageIndex={currentImageIndex}
          onNextImage={() =>
            setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
          }
          onPrevImage={() =>
            setCurrentImageIndex((prev) =>
              prev === 0 ? listing.images.length - 1 : prev - 1
            )
          }
          onShare={() => setIsShareOpen(true)}
          isFullyBooked={isFullyBooked}
        />

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
