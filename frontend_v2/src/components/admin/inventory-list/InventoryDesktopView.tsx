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
import Image from "next/image";

interface InventoryDesktopViewProps {
  data: Inventory[];
  openLockModal: (inv: Inventory) => void;
}

function InventoryDesktopView({
  data,
  openLockModal,
}: InventoryDesktopViewProps) {
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
            {data.length > 0 ? (
              data.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/40 relative">
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
                      <div>
                        <div className="font-bold truncate text-ellipsis text-foreground text-sm group-hover:text-lapis transition-colors">
                          {listing.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                          {listing.landlord_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium bg-muted/30 border border-border/20 w-fit px-2 py-1 rounded  truncate text-ellipsis">
                      <MapPin className="w-3.5 h-3.5" />
                      {listing.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />{" "}
                        {listing.stats.total_views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />{" "}
                        {listing.stats.total_inquiries}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-lapis"
                          style={{
                            width: `${
                              ((listing.vacancy_stats.filled || 0) /
                                (listing.vacancy_stats.total || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">
                        {listing.vacancy_stats.filled}/
                        {listing.vacancy_stats.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wide border ${
                        !listing.is_locked
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
                        onClick={() => openLockModal(listing)}
                        className={`p-1.5 rounded-lg transition-colors border cursor-pointer ${
                          listing.is_locked
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted/30 text-muted-foreground border-border/40 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                        }`}
                        title={
                          listing.is_locked ? "Unlock Listing" : "Lock Listing"
                        }
                      >
                        {listing.is_locked ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))
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
