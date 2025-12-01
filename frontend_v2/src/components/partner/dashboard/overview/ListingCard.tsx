import { ShareDialog } from "@/components/student/results/ShareDialog";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { RouterLink } from "@/routing/RouterLink";
import {
  Bed,
  Edit,
  Image as ImageIcon,
  Link,
  MapPin,
  Plus,
  Share2 as Share,
  Sparkles,
  Trash,
  TrendingUp,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  onDeleteRequest: () => void;
}

function ListingCard({ listing, onDeleteRequest }: ListingCardProps) {
  const faceImage =
    listing?.images?.find((image) => image?.is_face_image) ||
    listing?.images?.[0] ||
    null;

  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300">
        {/* Image Section */}
        <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {faceImage ? (
            <Image
              src={faceImage.display_image}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loader={myImageLoader}
              width={100}
              height={100}
              placeholder="blur"
              blurDataURL={getShimmerUrl(700, 475)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800">
              <ImageIcon className="w-10 h-10 opacity-50" />
              <span className="text-xs mt-2 font-medium">No Photos</span>
            </div>
          )}

          {/* Simple Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>

          {/* Top Bar Actions */}
          <div className="absolute top-3 sm:top-4 left-2 sm:left-4 right-4 flex justify-between items-start z-10">
            {/* Primary Badge - Top Left for Primacy */}
            <RouterLink
              to={{ page: "listings", listingId: listing.id, mode: "edit" }}
            >
              <div
                className={cn(
                  "px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-300 hover:scale-105 backdrop-blur-md border select-none",
                  listing.apply_agent_fee
                    ? "bg-amber-500/95 text-white border-amber-400/50 shadow-amber-900/20"
                    : "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-emerald-400/30 shadow-emerald-900/30 ring-1 ring-white/20"
                )}
                title={
                  listing.apply_agent_fee
                    ? "Student pays an agent fee"
                    : "No agent fees for students"
                }
              >
                {listing.apply_agent_fee ? (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xxs font-bold uppercase tracking-wider">
                      Student Pays Fee
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5px]" />
                    <span className="text-xxs font-extrabold uppercase tracking-wider">
                      Lanldlord Success Fee
                    </span>
                  </>
                )}
              </div>
            </RouterLink>

            <div className="flex items-center gap-2">
              {/* Photos Badge */}
              <RouterLink
                className="hidden sm:inline"
                to={{ page: "images", listingId: listing.id }}
              >
                <div className="bg-slate-900/50 backdrop-blur-sm text-white text-xxs font-bold px-2 py-2 rounded-full shadow-sm flex items-center gap-1.5 border border-white/10 cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>
                    {listing?.images?.length < 10
                      ? listing?.images?.length
                      : "9+"}
                  </span>
                </div>
              </RouterLink>
              {/* Share Button */}
              <button
                onClick={() => setIsShareOpen(true)}
                className="bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-sm text-white p-2 rounded-full shadow-sm border border-white/10 transition-all cursor-pointer"
                title="Share Property"
              >
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Location Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <h3 className="text-base font-bold leading-tight text-white drop-shadow-sm mb-0.5">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-100 drop-shadow-sm">
              <MapPin className="w-4 h-4 text-slate-200" />
              <span className="truncate opacity-95">
                {listing.neighborhood.name}, {listing.neighborhood.city}
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col p-5 bg-white dark:bg-slate-900">
          {/* Key Stats Row - GRID for Equal Width */}
          <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="p-2 bg-lapis/10 dark:bg-sky-500/10 text-lapis dark:text-sky-400 rounded-lg shrink-0">
                <Bed className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xsm sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {listing.rooms.length} Rooms
                </span>
                <span className="text-xxs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Capacity
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors pl-4 border-l border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-lapis/10 dark:bg-sky-500/10 text-lapis dark:text-sky-400 rounded-lg shrink-0">
                <Link className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xsm sm:text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums truncate">
                  {listing.distance_from_campus} mins
                </span>
                <span className="text-xxs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">
                  To Campus
                </span>
              </div>
            </div>
          </div>

          {/* Features (Amenities) Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xxs sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amenities
                </span>
              </div>
              <RouterLink
                className="justify-center"
                to={{ page: "amenities", listingId: listing.id }}
              >
                <button className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-lapis hover:text-white transition-all border border-slate-100 dark:border-slate-800 hover:border-lapis hover:shadow-sm cursor-pointer">
                  Edit
                </button>
              </RouterLink>
            </div>

            <RouterLink
              className="justify-center"
              to={{ page: "amenities", listingId: listing.id }}
            >
              <div className="flex flex-wrap gap-2 cursor-pointer">
                {listing?.amenities?.length === 0 ? (
                  <button className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-lapis/30 hover:text-lapis flex items-center justify-center gap-2 text-xs text-slate-400 font-bold transition-all group/empty cursor-pointer">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-white dark:text-slate-400 flex items-center justify-center group-hover/empty:bg-lapis transition-colors">
                      <Plus className="w-3 h-3" />
                    </div>
                    <span>Add amenities to attract tenants</span>
                  </button>
                ) : (
                  <>
                    {listing?.amenities?.slice(0, 5).map((amenity, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200/60 dark:border-slate-700"
                      >
                        {amenity.display_name}
                      </div>
                    ))}
                    {listing?.amenities?.length > 5 && (
                      <div
                        className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1.5 rounded-lg text-xxs font-bold border border-slate-200 dark:border-slate-700"
                        title={`${
                          listing?.amenities?.length - 5
                        } more amenities`}
                      >
                        +{listing?.amenities?.length - 5}
                      </div>
                    )}
                  </>
                )}
              </div>
            </RouterLink>
          </div>

          {/* Action Buttons Area */}
          <div className="mt-auto pt-4 space-y-3 border-t border-slate-50 dark:border-slate-800">
            {/* Primary Action */}
            <RouterLink
              className="w-full bg-lapis hover:bg-lapis-hover text-white py-3 rounded-xl font-bold text-xsm shadow-md shadow-lapis/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] group/btn hover:shadow-lg hover:shadow-lapis/30"
              to={{ page: "images", listingId: listing.id }}
            >
              <ImageIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span>Manage Photos</span>
            </RouterLink>
            {/* Secondary Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <RouterLink
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:text-lapis dark:hover:text-white hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]"
                to={{ page: "rooms", listingId: listing.id }}
              >
                <Bed className="w-4 h-4 opacity-70" />
                <span>Rooms</span>
              </RouterLink>

              <RouterLink
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:text-lapis dark:hover:text-white hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]"
                to={{ page: "listings", mode: "edit", listingId: listing.id }}
              >
                <Edit className="w-4 h-4 opacity-70" />
                <span>Details</span>
              </RouterLink>
            </div>

            {/* Footer Delete */}
            <div className="flex justify-end pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRequest(); // Just triggers the parent callback
                }}
                className="group cursor-pointer flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-crimson transition-colors px-2 py-1"
              >
                <Trash className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                <span>Remove Property</span>
              </button>
            </div>
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

export default ListingCard;
