import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ListingDetailHeroProps {
  listing: any;
}

function ListingDetailHero({ listing }: ListingDetailHeroProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const hasImages = listing.images && listing.images.length > 0;

  return (
    <div
      className="relative w-full h-[45vh] md:h-[55vh] bg-slate-200 dark:bg-slate-900 overflow-hidden group animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both"
      key={activeImageIndex}
    >
      {hasImages ? (
        <>
          {/* --- MOBILE: Simple Full Cover --- */}
          <div className="block md:hidden w-full h-full relative">
            <Image
              src={listing.images[activeImageIndex].display_image}
              alt={listing.title}
              className="object-cover"
              loader={myImageLoader}
              fill
              priority
              placeholder="blur"
              blurDataURL={getShimmerUrl(700, 475)}
            />
          </div>

          {/* --- DESKTOP: Cinematic Ambient Mode --- */}
          <div className="hidden md:flex relative w-full h-full items-center justify-center bg-black">
            {/* Layer 1: The Ambient Blur Background */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <Image
                src={listing.images[activeImageIndex].display_image}
                alt="Background ambience"
                loader={myImageLoader}
                fill
                className="object-cover blur-3xl scale-110 opacity-60"
                priority
              />
              {/* Overlay to dim the blur so the main image pops */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            </div>

            {/* Layer 2: The Main Contained Image */}
            <div className="relative z-10 w-full h-full p-6 flex items-center justify-center">
              <Image
                src={listing.images[activeImageIndex].display_image}
                alt={listing.title}
                className="object-contain max-w-full max-h-full drop-shadow-2xl shadow-black"
                loader={myImageLoader}
                width={1200}
                height={800}
                priority
                placeholder="blur"
                blurDataURL={getShimmerUrl(700, 475)}
              />
            </div>
          </div>
        </>
      ) : (
        // --- Fallback: No Images ---
        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
          <ImageIcon className="w-20 h-20" />
        </div>
      )}

      {/* --- Navigation Controls --- */}
      {hasImages && listing.images.length > 1 && (
        <div className="absolute z-20 bottom-20 right-4 lg:right-40 xl:right-60 flex gap-2 [&>button]:cursor-pointer">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) =>
                prev === 0 ? listing.images.length - 1 : prev - 1
              );
            }}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev + 1) % listing.images.length);
            }}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ListingDetailHero;
