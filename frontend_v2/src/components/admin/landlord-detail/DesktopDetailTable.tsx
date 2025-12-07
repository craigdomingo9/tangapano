import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { RouterLink } from "@/routing/RouterLink";
import { CheckCircle, Eye, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";

interface DesktopTableProps {
  listings: {
    id: string;
    title: string;
    landlord_name: string;
    campus_name: string;
    is_active: boolean;
    is_locked: string;
    vacancy_stats: {
      total: number;
      filled: number;
      left: number;
      percent: number;
    };
    main_image: string;
  }[];
  isLoading: boolean;
  isError: boolean;
}

function DesktopDetailTable({
  listings,
  isLoading,
  isError,
}: DesktopTableProps) {
  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="hidden md:block bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">Property</th>
              <th className="px-6 py-4 font-bold tracking-wider">Occupancy</th>
              <th className="px-6 py-4 font-bold tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {listings.map((listing) => (
              <tr
                key={listing.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden border border-border/40 shrink-0">
                      {listing.main_image && (
                        <Image
                          src={listing.main_image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          loader={myImageLoader}
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={getShimmerUrl(700, 475)}
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {listing.title}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {listing.campus_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-muted-foreground">
                    {listing.vacancy_stats.filled}/{listing.vacancy_stats.total}{" "}
                    Units Filled
                  </span>
                  <div className="w-24 h-1 bg-muted/50 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-lapis"
                      style={{
                        width: `${
                          (listing.vacancy_stats.filled /
                            listing.vacancy_stats.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase border ${
                      !listing.is_locked
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-muted/30 text-muted-foreground border-border/40"
                    }`}
                  >
                    {!listing.is_locked && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {listing.is_locked ? "LOCKED" : "ACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <RouterLink
                    to={{ page: "listings", listingId: listing.id }}
                    className="p-2 inline-flex items-center justify-center rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-lapis transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </RouterLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DesktopDetailTable;
