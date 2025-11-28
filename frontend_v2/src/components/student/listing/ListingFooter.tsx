import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ListingFooterProps {
  listing: Listing;
}

function ListingFooter({ listing }: ListingFooterProps) {
  const router = useRouter();

  const roomPrices = listing.rooms.map((_room) =>
    parseFloat(_room.rent_per_month)
  );
  const minRoomPrice = roomPrices.reduce((prev, curr) =>
    Math.min(curr, prev || 0)
  );
  const maxRoomPrice = roomPrices.reduce((prev, curr) =>
    Math.max(curr, prev || 0)
  );

  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 z-40 px-0 sm:px-6">
      <div className="max-w-3xl mx-auto p-4 sm:p-5 bg-white dark:bg-[#0f172a] border-t sm:border border-slate-100 dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:rounded-2xl">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-2xl font-bold text-[#0077b6] dark:text-blue-400 tracking-tight",
                  listing.rooms.length > 1 && "text-lg sm:text-2xl"
                )}
              >
                ${minRoomPrice}
                {listing.rooms.length > 1 && `-${maxRoomPrice}`}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                /month
              </span>
            </div>
            <span className="text-xxs font-medium text-slate-400 dark:text-slate-500">
              +${listing.campus.agent.agent_fee} Agent Fee
            </span>
          </div>

          <button
            onClick={() =>
              router.push(`/student?expressInterest=true&listing=${listing.id}`)
            }
            className="px-8 cursor-pointer py-3.5 rounded-lg bg-[#0e7490] hover:bg-[#0891b2] dark:bg-[#0e7490] dark:hover:bg-[#06b6d4] text-white font-bold text-base shadow-sm active:scale-[0.98] transition-all"
          >
            Express Interest
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingFooter;
