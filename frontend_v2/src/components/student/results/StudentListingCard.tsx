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

  // Helper to calculate pricing and availability
  const priceRange = useMemo(() => {
    if (listing?.rooms?.length === 0) return { min: 0, max: 0 };
    const rents = listing?.rooms.map((r: any) => parseFloat(r.rent_per_month));
    return { min: Math.min(...rents), max: Math.max(...rents) };
  }, [listing.rooms]);

  const handleExpressInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpressInterest(listing.id);
  };

  return (
    <>
      <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Image Carousel Section */}
        <ImageCarousel
          images={listing.images}
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
        />

        <ListingInfo
          listing={listing}
          priceRange={priceRange}
          isAmenitiesExpanded={isAmenitiesExpanded}
          onToggleAmenities={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
          onExpressInterest={handleExpressInterestClick}
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
