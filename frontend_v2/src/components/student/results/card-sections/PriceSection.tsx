import { Button } from "@/components/ui/button";

interface PriceSectionProps {
  onExpressInterest: (e: React.MouseEvent) => void;
  listing: Listing;
}

export default function PriceSection({
  onExpressInterest,
  listing,
}: PriceSectionProps) {
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

  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <div className="flex flex-col">
          <p className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            Monthly Rent
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${minPrice}
            </span>
            {isRange && (
              <span className="text-lg font-bold text-slate-400 dark:text-slate-500">
                {" "}
                - {maxPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={onExpressInterest}
        className="bg-lapis hover:bg-lapis-hover text-white font-semibold shadow-md shadow-lapis/20 rounded-lg px-6 py-6 cursor-pointer"
      >
        Express Interest
      </Button>
    </div>
  );
}
