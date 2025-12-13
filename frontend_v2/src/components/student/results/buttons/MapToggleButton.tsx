import { cn } from "@/lib/utils";
import { ImageIcon, MapPin } from "lucide-react";

interface MapToggleButtonProps {
  showMap: boolean;
  setShowMap: (state: boolean) => void;
  containerClassName?: string;
}

function MapToggleButton({
  showMap,
  setShowMap,
  containerClassName,
}: MapToggleButtonProps) {
  return (
    <div
      className={cn(
        "absolute bottom-4 right-4 z-30 cursor-pointer",
        containerClassName
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMap(!showMap);
        }}
        className={cn(
          "group/mapbtn cursor-pointer relative flex items-center gap-0 sm:gap-2 rounded-full p-1 shadow-xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 border",
          "pr-1 sm:pr-3.5", // Responsive padding: circular on mobile, pill on desktop
          showMap
            ? "bg-white border-slate-100 text-slate-900 hover:bg-slate-50"
            : "bg-slate-900/80 border-white/10 text-white backdrop-blur-md hover:bg-slate-900"
        )}
      >
        <div
          className={cn(
            "relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shadow-inner transition-colors duration-300",
            showMap
              ? "bg-slate-100 text-slate-600 group-hover/mapbtn:bg-slate-200"
              : "bg-white/10 text-white group-hover/mapbtn:bg-white/20"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              showMap
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
            )}
          >
            <ImageIcon className="w-4 h-4" />
          </div>
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              !showMap
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-50"
            )}
          >
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        {/* Text Label - Hidden on Mobile */}
        <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">
          {showMap ? "Photos" : "Map View"}
        </span>
      </button>
    </div>
  );
}

export default MapToggleButton;
