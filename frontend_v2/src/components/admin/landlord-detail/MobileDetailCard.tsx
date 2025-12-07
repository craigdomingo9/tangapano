import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { RouterLink } from "@/routing/RouterLink";
import { Building2, Eye, MapPin } from "lucide-react";
import Image from "next/image";

interface MobileDetailCardProps {
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

function MobileDetailCard({
  listings,
  isLoading,
  isError,
}: MobileDetailCardProps) {
  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="md:hidden flex flex-col gap-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="p-4 bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden shrink-0 border border-border/40 relative">
              {listing.main_image ? (
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
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Building2 className="w-6 h-6 opacity-20" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-foreground truncate text-sm">
                  {listing.title}
                </h4>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold uppercase border shrink-0 ${
                    !listing.is_locked
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-muted/30 text-muted-foreground border-border/40"
                  }`}
                >
                  {listing.is_locked ? "LOCKED" : "ACTIVE"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate text-ellipsis">
                <MapPin className="w-3 h-3 shrink-0" /> {listing.campus_name}
              </div>
            </div>
          </div>

          {/* Stats & Action */}
          <div className="mt-4 pt-4 border-t border-border/20 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">
                  Occupancy Rate
                </span>
                <span className="text-muted-foreground font-bold">
                  {listing.vacancy_stats.filled}/{listing.vacancy_stats.total}{" "}
                  Units
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
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
            </div>

            <RouterLink
              to={{ page: "listings", listingId: listing.id }}
              className="flex items-center justify-center w-full py-2.5 bg-muted/20 hover:bg-lapis/10 hover:text-lapis border border-border/40 hover:border-lapis/20 text-muted-foreground rounded-xl text-sm font-semibold transition-all gap-2 group"
            >
              <Eye className="w-3.5 h-3.5" /> View Property Details
            </RouterLink>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MobileDetailCard;
