import { Button } from "@/components/ui/button";

interface PriceSectionProps {
  priceRange: { min: number; max: number };
  applyAgentFee: boolean;
  agentFee: number;
  onExpressInterest: (e: React.MouseEvent) => void;
}

export default function PriceSection({
  priceRange,
  applyAgentFee,
  agentFee,
  onExpressInterest,
}: PriceSectionProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-lapis dark:text-sky-400">
            ${priceRange.min}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            /month
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {applyAgentFee ? `+$${agentFee} Agent Fee` : "Zero Agent Fees"}
        </p>
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
