import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp, Home, LinkIcon } from "lucide-react";
import { useState } from "react";

interface ListingInfoProps {
  listing: Listing;
}

function ListingInfo({ listing }: ListingInfoProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const AMENITIES_MIN = 6;
  const visibleAmenities = showAllAmenities
    ? listing.amenities
    : listing.amenities.slice(0, AMENITIES_MIN);
  return (
    <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">
      {/* Stats Cards - Blueish Background */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rooms Available Card */}
        <div className="bg-blue-50/50 dark:bg-slate-800 p-4 rounded-2xl flex items-center sm:justify-center sm:gap-6 gap-2 border border-blue-100 dark:border-slate-700">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 rounded-full shrink-0">
            <Home size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
              {listing.rooms.length} Rooms Available
            </p>
            <p className="text-xxs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider">
              CAPACITY
            </p>
          </div>
        </div>

        {/* Distance Card */}
        <div className="bg-blue-50/50 dark:bg-slate-800 p-4 rounded-2xl flex items-center sm:justify-center sm:gap-6 gap-2 border border-blue-100 dark:border-slate-700">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 rounded-full shrink-0">
            <LinkIcon size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              30 mins
            </p>
            <p className="text-xxs font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider">
              TO CAMPUS
            </p>
          </div>
        </div>
      </div>

      {/* Amenities Section - Green Pills */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">
          AMENITIES
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {visibleAmenities.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300"
              style={{ animationDelay: `${idx * 20}ms` }}
            >
              <Check size={12} strokeWidth={3} />
              {item.display_name}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowAllAmenities(!showAllAmenities)}
          className={cn(
            "flex cursor-pointer items-center gap-1 text-sm font-bold text-[#005f87] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-2",
            listing.amenities.length < AMENITIES_MIN && "hidden"
          )}
        >
          <span>
            {showAllAmenities ? "Expand Amenities" : "Expand Amenities"}
          </span>
          {showAllAmenities ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ListingInfo;
