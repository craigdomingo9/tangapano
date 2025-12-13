import { LazyMapWrapper } from "@/components/common/maps/LazyMapWrapper";
import { Portal } from "@/components/ui/Portal";
import { X } from "lucide-react";

interface FullScreenListingMapProps {
  listing: Listing;
  turnFullScreenOff: () => void;
}

function FullScreenListingMap({
  listing,
  turnFullScreenOff,
}: FullScreenListingMapProps) {
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950 animate-in fade-in duration-300 overflow-clip min-h-screen">
        {/* Header */}
        <div className="z-10 sticky top-0 flex items-center justify-between px-4 py-3 bg-crimson dark:bg-app-header backdrop-blur-md shadow-sm">
          <div>
            <h3 className="font-bold text-white text-lg">{listing.title}</h3>
            <p className="text-xs text-slate-300 dark:text-slate-400">
              {listing.neighborhood.name}, {listing.campus.city?.name}
            </p>
          </div>
          <button
            onClick={turnFullScreenOff}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full Map */}
        <div className="flex-1 relative">
          <LazyMapWrapper listing={listing} isFullScreen />
        </div>
      </div>
    </Portal>
  );
}

export default FullScreenListingMap;
