import { Inventory } from "@/lib/api/admin/inventory";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { Building, Eye, Lock, MapPin, Unlock, User } from "lucide-react";
import Image from "next/image";
import { warningToast } from "@/lib/toast";

interface InventoryHeroProps {
  listing: Inventory;
  user: User;
  setIsPreviewModalOpen: (val: boolean) => void;
  setIsLockModalOpen: (val: boolean) => void;
}

function InventoryHero({
  listing,
  user,
  setIsPreviewModalOpen,
  setIsLockModalOpen,
}: InventoryHeroProps) {
  // Check if user has permission to change listing
  const hasChangeListingPermission = user?.employee_profile?.role?.permissions?.some(
    (permission) => permission.codename === "change_listing"
  ) ?? false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 relative h-80 rounded-2xl overflow-hidden shadow-2xl group border border-border/40 bg-card">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10"></div>
        {/* Mock Image Background */}
        {listing?.main_image ? (
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
          <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
            <Building className="w-24 h-24 opacity-20" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 backdrop-blur-md text-xxs font-bold rounded uppercase tracking-wider border ${!listing?.is_locked
                    ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30"
                    : "bg-red-500/20 text-red-100 border-red-500/30"
                    }`}
                >
                  {listing?.is_locked ? "Locked" : "Active"}
                </span>
                <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3" /> {listing?.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                {listing?.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="w-full py-3 bg-muted/30 hover:bg-muted border border-border/40 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 text-foreground cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Preview Public Page
            </button>
            {listing.is_locked ? (
              <button
                onClick={() => {
                  if (!hasChangeListingPermission) {
                    warningToast("You don't have permission to unlock listings");
                    return;
                  }
                  setIsLockModalOpen(true);
                }}
                className={`w-full py-3 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${hasChangeListingPermission
                    ? "cursor-pointer hover:bg-emerald-500/20"
                    : "opacity-70 cursor-not-allowed"
                  }`}
              >
                <Unlock className="w-4 h-4" /> Unlock Listing
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!hasChangeListingPermission) {
                    warningToast("You don't have permission to lock listings");
                    return;
                  }
                  setIsLockModalOpen(true);
                }}
                className={`w-full py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${hasChangeListingPermission
                    ? "cursor-pointer hover:bg-destructive hover:text-white"
                    : "opacity-70 cursor-not-allowed"
                  }`}
              >
                <Lock className="w-4 h-4" /> Lock Listing
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-lapis to-secondary flex items-center justify-center text-white font-bold shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Managed by
              </div>
              <div className="font-bold text-foreground">
                {listing?.landlord_name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryHero;
