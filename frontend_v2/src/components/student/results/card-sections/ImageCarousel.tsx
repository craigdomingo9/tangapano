import { Image as ImageIcon, Info, Share2, Sparkles } from "lucide-react";
import CarouselControls from "./CarouselControls";
import PaginationDots from "./PaginationDots";
import ImageOverlay from "./ImageOverlay";
import Image from "next/image";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { useSwipe } from "@/hooks/use-swipe";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  listing: Listing;
  title: string;
  neighborhood: string;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onShare: () => void;
}

export default function ImageCarousel({
  listing,
  title,
  neighborhood,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onShare,
}: ImageCarouselProps) {
  const images = listing?.images || [];

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  // --- Navigation Logic ---
  const handlePrev = () => {
    onPrevImage();
  };

  const handleNext = () => {
    onNextImage();
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
      className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden"
    >
      {/* Image Display */}
      {currentImage ? (
        <Image
          key={currentImage?.display_image}
          src={currentImage.display_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 animate-in fade-in slide-in-from-right-4 fill-mode-both touch-pan-y"
          loader={myImageLoader}
          width={100}
          height={100}
          placeholder="blur"
          blurDataURL={getShimmerUrl(700, 475)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
          <ImageIcon className="w-12 h-12" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />

      {/* Carousel Controls */}
      {hasImages && images.length > 1 && (
        <>
          <CarouselControls onPrev={onPrevImage} onNext={onNextImage} />
          <PaginationDots
            total={images.length}
            currentIndex={currentImageIndex}
          />
        </>
      )}

      {/* Top Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
        {/* Fee Badge (Prominent) - Left Aligned */}
        <div
          className={cn(
            "px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border flex items-center gap-1.5 transition-transform hover:scale-105 select-none",
            listing.apply_agent_fee
              ? "bg-amber-500/90 border-amber-400/50 text-white shadow-amber-900/10"
              : "bg-emerald-500/90 border-emerald-400/50 text-white shadow-emerald-900/10 bg-linear-to-r from-emerald-500 to-teal-500"
          )}
        >
          {listing.apply_agent_fee ? (
            <Info className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
          )}
          <span className="text-xxs font-bold uppercase tracking-wider leading-none mt-0.5">
            {listing.apply_agent_fee ? "Agent Fee Applies" : "No Agent Fees"}
          </span>
        </div>
        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Caption Badge */}
          <div className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
            <span className="text-xxs font-bold text-white uppercase tracking-wider">
              {currentImage?.caption}
            </span>
          </div>
          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/10 transition-colors shadow-sm z-20 cursor-pointer"
          >
            <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </div>

      {/* {currentImage?.caption && (
        <div className="absolute top-4 left-4 z-20">
        </div>
      )} */}

      {/* Bottom Info Overlay */}
      <ImageOverlay title={title} neighborhood={neighborhood} />
    </div>
  );
}
