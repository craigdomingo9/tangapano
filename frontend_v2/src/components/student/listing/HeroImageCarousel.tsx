import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { ChevronLeft, ChevronRight, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroImageCarouselProps {
  listing: Listing;
}

function HeroImageCarousel({ listing }: HeroImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const images = listing.images || [];

  // Auto-rotate images
  useEffect(() => {
    if (isHovering) return; // Pause on hover
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentImageIndex, isHovering]);

  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      className="relative w-full max-w-5xl mx-auto aspect-4/3 sm:aspect-video bg-gray-900 overflow-hidden group shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Image */}
      <div className="w-full h-full relative">
        <Image
          src={images[currentImageIndex].display_image}
          alt={`Property view ${currentImageIndex + 1}`}
          loader={myImageLoader}
          width={100}
          height={100}
          placeholder="blur"
          blurDataURL={getShimmerUrl(700, 475)}
          className={`w-full h-full object-cover transition-transform duration-1500 ease-out ${
            isAnimating ? "scale-105" : "scale-100"
          }`}
        />
        {/* Preload next image */}
        <Image
          src={images[(currentImageIndex + 1) % images.length].display_image}
          className="hidden"
          alt="preload"
          loader={myImageLoader}
          width={100}
          height={100}
          placeholder="blur"
          blurDataURL={getShimmerUrl(700, 475)}
        />
      </div>

      {/* Gradient Overlay - Bottom only for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Middle Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
        className="absolute cursor-pointer top-1/2 left-3 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-transform active:scale-95"
        aria-label="Previous Image"
      >
        <ChevronLeft size={16} strokeWidth={3} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-transform active:scale-95"
        aria-label="Next Image"
      >
        <ChevronRight size={16} strokeWidth={3} />
      </button>

      {/* Dots Indicators at Bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`
                  w-1 h-1 rounded-full transition-all duration-300 shadow-sm
                  ${
                    idx === currentImageIndex
                      ? "bg-white scale-110"
                      : "bg-white/50"
                  }
                `}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-4 left-0 right-0 px-6 z-10">
        <div className="max-w-3xl mx-auto space-y-0">
          <h2 className="text-lg sm:text-2xl font-semibold leading-tight text-white drop-shadow-md">
            {listing.title}
          </h2>
          <div className="flex items-center gap-1.5 text-gray-200">
            <MapPin size={16} className="text-gray-300 shrink-0" />
            <span className="font-medium text-xsm sm:text-base opacity-90">
              {listing.neighborhood.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroImageCarousel;
