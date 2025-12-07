import { getAcronym } from "@/lib/utils";
import { RouterLink } from "@/routing/RouterLink";
import { ArrowRight, MapPin } from "lucide-react";

interface HotPropertiesTableProps {
  hotProperties: any[] | null;
}

function HotPropertiesTable({ hotProperties }: HotPropertiesTableProps) {
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            Hot Properties
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Top <span className="hidden sm:inline">performing</span> listings
            <span className="hidden sm:inline"> by engagement</span>
          </p>
        </div>
        <RouterLink
          to={{ page: "analytics" }}
          className="text-xs font-bold text-lapis hover:text-lapis/80 uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <span className="hidden sm:inline">View</span> Full Report{" "}
          <ArrowRight className="w-3 h-3" />
        </RouterLink>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">
                Listing Title
              </th>
              <th className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">
                Location
              </th>
              <th className="px-6 py-4 font-bold tracking-wider text-right whitespace-nowrap">
                Views
              </th>
              <th className="px-6 py-4 font-bold tracking-wider text-right whitespace-nowrap">
                Inquiries
              </th>
              <th className="px-6 py-4 font-bold tracking-wider text-right whitespace-nowrap">
                Conv. Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {hotProperties
              ?.slice(0, 5)
              ?.sort((a, b) => b?.views - a?.views)
              ?.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-foreground/70 whitespace-nowrap group-hover:text-lapis transition-colors">
                    <RouterLink to={{ page: "listing", listingId: listing.id }}>
                      {listing.title}
                    </RouterLink>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-semibold text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {listing.location.split(" ").length == 1
                        ? listing.location.split(" ")[0]
                        : getAcronym(listing.location)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    {listing.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    {listing.inquiries}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs shadow-sm">
                      {((listing.inquiries / listing.views) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HotPropertiesTable;
