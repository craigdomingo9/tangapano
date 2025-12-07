import { Filter, MapPin } from "lucide-react";
import { useState } from "react";
import Pagination from "../common-components/Pagination";
import { getAcronym } from "@/lib/utils";

interface ListingPerformanceProps {
  data: any[];
  isLoading: boolean;
  isError: boolean;
}

const ITEMS_PER_PAGE = 5;

function ListingPerformance({
  data,
  isLoading,
  isError,
}: ListingPerformanceProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCampus, setFilterCampus] = useState("All Locations");

  // Filter Data
  const filteredListings = data
    ?.filter(
      (l) => filterCampus === "All Locations" || l.location === filterCampus
    )
    ?.sort((a, b) => b.views - a.views);

  const locations = [
    "All Locations",
    ...new Set(data?.map((l) => l.location)),
  ] as string[];

  // Pagination
  const totalItems = filteredListings?.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedListings = filteredListings?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (!data?.length) return null;
  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 gap-4">
        <h3 className="font-bold text-lg text-foreground pl-2 tracking-tight">
          Listing Performance
        </h3>
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            className="appearance-none pl-9 pr-8 py-2 bg-black/20 border border-white/10 rounded-lg text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 outline-none w-full sm:w-48 cursor-pointer shadow-sm transition-all"
            value={filterCampus}
            onChange={(e) => {
              setFilterCampus(e.target.value);
              setCurrentPage(1);
            }}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
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
            {paginatedListings.map((listing) => (
              <tr
                key={listing.id}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                  {listing.title}
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
                  <span className="font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs shadow-sm">
                    {((listing.inquiries / listing.views) * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}

export default ListingPerformance;
