import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
}

export default function CarouselControls({
  onPrev,
  onNext,
}: CarouselControlsProps) {
  const buttonClass =
    "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm z-20 md:opacity-0 md:group-hover:opacity-100 cursor-pointer";

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev(e);
        }}
        className={`${buttonClass} left-2`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext(e);
        }}
        className={`${buttonClass} right-2`}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </>
  );
}
