import { Inventory } from "@/lib/api/admin/inventory";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { RouterLink } from "@/routing/RouterLink";
import {
  Bed,
  ExternalLink,
  Lock,
  MapPin,
  MessageCircle,
  Unlock,
} from "lucide-react";
import Image from "next/image";

interface InventoryMobileViewProps {
  data: Inventory[];
  openLockModal: (inv: Inventory) => void;
}

function InventoryMobileView({
  data,
  openLockModal,
}: InventoryMobileViewProps) {
  return (
    <div className="md:hidden flex flex-col gap-4">
      {data.length > 0 ? (
        data.map((listing) => (
          <div
            key={listing.id}
            className="p-5 bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl shadow-lg relative"
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/40 relative">
                {listing.main_image ? (
                  <Image
                    src={listing.main_image}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loader={myImageLoader}
                    width={100}
                    height={100}
                    placeholder="blur"
                    blurDataURL={getShimmerUrl(700, 475)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                  </div>
                )}
                {listing.is_locked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-foreground text-sm line-clamp-1">
                      {listing.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {listing.landlord_name}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase tracking-wide border ${
                      !listing.is_locked
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {listing.is_locked ? "Locked" : "Active"}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-border/20">
              <div className="p-2 bg-muted/20 rounded-lg border border-border/20 flex flex-col items-center justify-center">
                <span className="text-xxs text-muted-foreground uppercase font-bold tracking-wider">
                  Inquiries
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-foreground mt-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  {listing.stats.total_inquiries}
                </div>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg border border-border/20 flex flex-col items-center justify-center">
                <span className="text-xxs text-muted-foreground uppercase font-bold tracking-wider">
                  Occupancy
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-foreground mt-1">
                  <Bed className="w-3.5 h-3.5 text-lapis" />
                  {listing.vacancy_stats.filled}/{listing.vacancy_stats.total}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openLockModal(listing)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                  listing.is_locked
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-muted/30 text-muted-foreground border-border/40"
                }`}
              >
                {listing.is_locked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" /> Unlock
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Lock
                  </>
                )}
              </button>
              <RouterLink
                to={{ page: "listings", listingId: listing.id.toString() }}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-lapis/10 text-lapis border border-lapis/20 rounded-xl text-xs font-bold transition-all hover:bg-lapis/20 cursor-pointer"
              >
                Manage
                <ExternalLink className="w-3.5 h-3.5" />
              </RouterLink>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-muted-foreground bg-card/40 border border-border/40 rounded-xl">
          No listings found.
        </div>
      )}
    </div>
  );
}

export default InventoryMobileView;
