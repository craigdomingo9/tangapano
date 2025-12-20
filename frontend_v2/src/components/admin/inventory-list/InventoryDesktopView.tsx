import { Inventory } from "@/lib/api/admin/inventory";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { RouterLink } from "@/routing/RouterLink";
import {
  CheckCircle,
  ExternalLink,
  Eye,
  Lock,
  MapPin,
  MessageCircle,
  Unlock,
} from "lucide-react";
import { warningToast } from "@/lib/toast";
import Image from "next/image";

interface InventoryDesktopViewProps {
  data: Inventory[];
  user: User;
  openLockModal: (inv: Inventory) => void;
}

function InventoryDesktopView({
  data,
  user,
  openLockModal,
}: InventoryDesktopViewProps) {
  const hasData = Array.isArray(data) && data.length > 0;

  // Check if user has permission to change listing
  const hasChangeListingPermission = user?.employee_profile?.role?.permissions?.some(
    (permission) => permission.codename === "change_listing"
  ) ?? false;


  return (
    <div className="hidden md:block bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">Property</th>
              <th className="px-6 py-4 font-bold tracking-wider">Location</th>
              <th className="px-6 py-4 font-bold tracking-wider">
                Performance
              </th>
              <th className="px-6 py-4 font-bold tracking-wider">Occupancy</th>
              <th className="px-6 py-4 font-bold tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {hasData ? (
              data.map((listing) => {
                if (!listing) return null;

                const filled = listing.vacancy_stats?.filled ?? 0;
                const total = listing.vacancy_stats?.total || 1; // Default to 1 to avoid /0
                const occupancyPercentage = (filled / total) * 100;

                return (
                  <tr
                    key={listing.id || Math.random()}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <RouterLink
                        to={{
                          page: "listings",
                          listingId: listing.id.toString(),
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/40 relative">
                            {listing.main_image ? (
                              <Image
                                src={listing.main_image}
                                alt={listing.title || "Property"}
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
                          <div>
                            <div className="font-bold truncate text-ellipsis text-foreground text-sm group-hover:text-lapis transition-colors">
                              {listing.title || "Untitled Property"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                              {listing.landlord_name || "Unknown Landlord"}
                            </div>
                          </div>
                        </div>
                      </RouterLink>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium bg-muted/30 border border-border/20 w-fit px-2 py-1 rounded truncate text-ellipsis">
                        <MapPin className="w-3.5 h-3.5" />
                        {listing.location || "No Location"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />{" "}
                          {(listing.stats?.total_views ?? 0).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                          {listing.stats?.total_inquiries ?? 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-lapis transition-all duration-500"
                            style={{
                              width: `${Math.min(occupancyPercentage, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">
                          {filled}/{listing.vacancy_stats?.total ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wide border ${!listing.is_locked
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}
                      >
                        {!listing.is_locked ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {listing.is_locked ? "Locked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (!hasChangeListingPermission) {
                              warningToast(
                                listing.is_locked
                                  ? "You don't have permission to unlock listings"
                                  : "You don't have permission to lock listings"
                              );
                              return;
                            }
                            openLockModal && openLockModal(listing);
                          }}
                          className={`p-1.5 rounded-lg transition-colors border ${listing.is_locked
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted/30 text-muted-foreground border-border/40 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                            } ${hasChangeListingPermission
                              ? "cursor-pointer"
                              : "opacity-70 cursor-not-allowed"
                            }`}
                          title={listing.is_locked ? "Unlock Listing" : "Lock Listing"}
                        >
                          {listing.is_locked ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </button>
                        {listing.id && (
                          <RouterLink
                            to={{
                              page: "listings",
                              listingId: listing.id.toString(),
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-muted/30 hover:bg-lapis/20 hover:text-lapis hover:border-lapis/30 border border-border/40 text-muted-foreground rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Manage
                            <ExternalLink className="w-3 h-3" />
                          </RouterLink>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryDesktopView;
