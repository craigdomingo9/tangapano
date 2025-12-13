import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useSwipe } from "@/hooks/use-swipe"; // Adjust path as needed
import MapToggleButton from "../results/buttons/MapToggleButton";
import FullScreenListingMap from "@/components/common/maps/FullScreenListingMap";

interface ListingDetailHeroProps {
  listing: any;
}

function ListingDetailHero({ listing }: ListingDetailHeroProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const hasLocation = !(
    !listing.location ||
    !listing.location.lat ||
    !listing.location.lon ||
    !listing.campus_location ||
    !listing.campus_location.lat ||
    !listing.campus_location.lon
  );

  const hasImages = listing.images && listing.images.length > 0;

  // --- Navigation Logic ---
  const handlePrev = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  // --- Swipe Handlers ---
  const swipeHandlers = useSwipe({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
    minSwipeDistance: 50,
  });

  return (
    <div
      {...swipeHandlers}
      className="relative w-full h-[45vh] md:h-[55vh] bg-slate-200 dark:bg-slate-900 overflow-hidden group"
    >
      {hasImages ? (
        <>
          {/* --- MOBILE: Simple Full Cover --- */}
          <div className="block md:hidden w-full h-full relative">
            <Image
              key={activeImageIndex}
              src={listing.images[activeImageIndex].display_image}
              alt={listing.title}
              className="object-cover transition-transform duration-700 animate-in fade-in slide-in-from-right-4 fill-mode-both touch-pan-y"
              loader={myImageLoader}
              fill
              preload
              placeholder="blur"
              blurDataURL={getShimmerUrl(700, 475)}
              draggable={false}
              quality={100}
            />
          </div>

          {/* --- DESKTOP: Cinematic Ambient Mode --- */}
          <div className="hidden md:flex relative w-full h-full items-center justify-center bg-black">
            {/* Layer 1: Ambient Blur */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                key={`bg-${activeImageIndex}`}
                src={listing.images[activeImageIndex].display_image}
                alt="Background ambience"
                loader={myImageLoader}
                fill
                className="object-cover blur-3xl scale-110 opacity-60"
                preload
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            </div>

            {/* Layer 2: Main Contained Image */}
            <div className="relative z-10 w-full h-full p-6 flex items-center justify-center">
              <Image
                key={`main-${activeImageIndex}`}
                src={listing.images[activeImageIndex].display_image}
                alt={listing.title}
                className="object-contain max-w-full max-h-full drop-shadow-2xl shadow-black"
                loader={myImageLoader}
                width={1200}
                height={800}
                preload
                placeholder="blur"
                blurDataURL={getShimmerUrl(700, 475)}
                draggable={false}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
          <ImageIcon className="w-20 h-20" />
        </div>
      )}

      {/* --- Navigation Controls --- */}
      {hasImages && listing.images.length > 1 && (
        <div className="absolute z-40 bottom-20 right-4 lg:right-40 xl:right-60 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      {hasLocation && (
        <MapToggleButton
          showMap={showMap}
          setShowMap={(show: boolean) => setShowMap(show)}
          containerClassName="bottom-20 left-4 lg:left-40 xl:left-60"
        />
      )}
      {showMap && hasLocation && (
        <FullScreenListingMap
          listing={listing}
          turnFullScreenOff={() => setShowMap(false)}
        />
      )}
    </div>
  );
}

export default ListingDetailHero;
