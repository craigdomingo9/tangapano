import { Image, Share2 } from "lucide-react";
import CarouselControls from "./CarouselControls";
import PaginationDots from "./PaginationDots";
import ImageOverlay from "./ImageOverlay";

interface ImageCarouselProps {
  images: any[];
  title: string;
  neighborhood: string;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onShare: () => void;
}

export default function ImageCarousel({
  images,
  title,
  neighborhood,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onShare,
}: ImageCarouselProps) {
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  return (
    <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden">
      {/* Image Display */}
      {currentImage ? (
        <img
          src={currentImage.display_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
          <Image className="w-12 h-12" />
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

      {/* Share Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShare();
        }}
        className="absolute top-4 right-3 sm:right-4 bg-slate-500/60 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-slate-900/80 transition-colors shadow-sm z-20 cursor-pointer"
      >
        <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
      </button>

      {/* Bottom Info Overlay */}
      <ImageOverlay title={title} neighborhood={neighborhood} />
    </div>
  );
}
