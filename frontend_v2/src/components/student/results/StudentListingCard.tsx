import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Image,
  MapPin,
  Share,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ShareDialog } from "./ShareDialog";

interface StudentListingCardProps {
  listing: Listing;
  onExpressInterest: (listing: Listing) => void;
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
    if (listing.rooms.length === 0) return { min: 0, max: 0 };
    const rents = listing.rooms.map((r: any) => parseFloat(r.rent_per_month));
    return { min: Math.min(...rents), max: Math.max(...rents) };
  }, [listing.rooms]);

  const hasImages = listing.images.length > 0;
  const currentImage = hasImages ? listing.images[currentImageIndex] : null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex(
        (prev: number) => (prev + 1) % listing.images.length
      );
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex((prev: number) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const handleExpressInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpressInterest(listing);
  };

  return (
    <>
      <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Image Carousel Section */}
        <div
          className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
          onClick={handleExpressInterestClick}
        >
          {currentImage ? (
            <img
              src={currentImage.display_image}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
              <Image className="w-12 h-12" />
            </div>
          )}

          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />

          {/* Carousel Controls */}
          {hasImages && listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {listing.images.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                      idx === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Share Button - Lowered z-index from 30 to 20 to prevent header overlap */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-slate-900/80 transition-colors shadow-sm z-20"
          >
            <Share className="w-4 h-4" />
          </button>

          {/* Bottom Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight leading-tight shadow-sm drop-shadow-md">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-200 text-sm font-medium drop-shadow-sm">
              <MapPin className="w-4 h-4 opacity-80" />
              <span>{listing.neighborhood.name}</span>
            </div>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-5 pt-6 flex flex-col gap-6 flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Capacity Block */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-lapis/10 dark:bg-sky-500/10 flex items-center justify-center text-lapis dark:text-sky-400 shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-slate-900 dark:text-slate-200 font-bold text-sm truncate">
                  {listing.rooms.length} Rooms Available
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate">
                  CAPACITY
                </span>
              </div>
            </div>

            {/* Distance Block */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-lapis/10 dark:bg-sky-500/10 flex items-center justify-center text-lapis dark:text-sky-400 shrink-0">
                <Link className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-slate-900 dark:text-slate-200 font-bold text-sm truncate">
                  {listing.distance_from_campus} mins
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate">
                  TO CAMPUS
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                Amenities
              </h4>
            </div>

            <div
              className={cn(
                "relative transition-all duration-500 ease-in-out overflow-hidden",
                isAmenitiesExpanded ? "max-h-[500px]" : "max-h-[72px]"
              )}
            >
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity: Amenity) => (
                  <Badge
                    key={amenity.id}
                    variant="secondary"
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {amenity.display_name}
                  </Badge>
                ))}
              </div>

              {/* Gradient Overlay when collapsed */}
              {!isAmenitiesExpanded && listing.amenities.length > 0 && (
                <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAmenitiesExpanded(!isAmenitiesExpanded);
              }}
              className="text-xs font-bold text-lapis dark:text-sky-400 hover:text-lapis-hover dark:hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              {isAmenitiesExpanded ? "Show Less" : "Expand Amenities"}
              <ChevronRight
                className={cn(
                  "w-3 h-3 transition-transform",
                  isAmenitiesExpanded ? "-rotate-90" : "rotate-90"
                )}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-auto" />

          {/* Price & CTA Section */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-lapis dark:text-sky-400">
                  ${priceRange.min}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  /month
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {listing.apply_agent_fee
                  ? "+$5.00 Agent Fee"
                  : "Zero Agent Fees"}
              </p>
            </div>

            <Button
              onClick={handleExpressInterestClick}
              className="bg-lapis hover:bg-lapis-hover text-white font-semibold shadow-md shadow-lapis/20 rounded-lg px-6"
            >
              Express Interest
            </Button>
          </div>
        </div>
      </div>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        listing={listing}
      />
    </>
  );
}
