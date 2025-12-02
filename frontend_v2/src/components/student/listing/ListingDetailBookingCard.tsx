import { Button } from "@/components/ui/button";
import { useRouterPush } from "@/hooks/use-router-push";
import { StudentParams } from "@/lib/types/student";
import { TrendingUp, User } from "lucide-react";
import React from "react";

interface ListingDetailBookingCardProps {
  listing: Listing;
}

function ListingDetailBookingCard({ listing }: ListingDetailBookingCardProps) {
  const { push } = useRouterPush<StudentParams>();
  // 1. Safety: Handle undefined rooms or empty arrays
  const rooms = listing.rooms || [];

  // 2. Parse prices and filter out invalid data (NaN)
  const prices = rooms
    .map((r) => parseFloat(r.rent_per_month))
    .filter((p) => !isNaN(p));

  // 3. Calculate Min and Max securely
  // Using spread (...) is cleaner than reduce here, but we must check length first
  const hasPrices = prices.length > 0;
  const minPrice = hasPrices ? Math.min(...prices) : 0;
  const maxPrice = hasPrices ? Math.max(...prices) : 0;

  // 4. Determine if we show a range
  // Only show range if min != max.
  // (e.g. If listing has 5 rooms but all are $100, show "$100", not "$100 - $100")
  const isRange = minPrice !== maxPrice;

  function onExpressInterest() {
    push({
      page: "interest",
      listingId: listing.id,
    });
  }

  return (
    <div className="lg:pt-0">
      <div className="sticky top-24 space-y-6">
        {/* Booking Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 border border-slate-100 dark:border-slate-800">
          <div className="mb-6">
            <span className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              ${minPrice}
            </span>
            {minPrice !== maxPrice && (
              <span className="text-xl text-slate-400"> - ${maxPrice}</span>
            )}
            <span className="text-slate-500 font-medium text-sm ml-1">
              / month
            </span>
          </div>

          {/* Minimal Agent Fee Display */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
            {listing.apply_agent_fee ? (
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
                <User className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Fee Model
              </p>
              <p className="text-xsm sm:text-sm font-semibold text-slate-900 dark:text-white">
                {listing.apply_agent_fee
                  ? "Student Pays Agent Fee"
                  : "Zero Agent Fees"}
              </p>
            </div>
          </div>

          <Button
            onClick={onExpressInterest}
            className="w-full h-12 text-base font-bold bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-xl shadow-lg shadow-lapis/20 transition-transform active:scale-95"
          >
            Express Interest
          </Button>

          <p className="text-center text-xs text-slate-400 mt-3">
            Click to check availability
          </p>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailBookingCard;
