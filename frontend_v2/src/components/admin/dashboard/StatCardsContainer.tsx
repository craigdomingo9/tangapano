import { RouterLink } from "@/routing/RouterLink";
import StatCard from "./StatCard";
import { AlertCircle, BedDouble, DollarSign, Users } from "lucide-react";

interface StatCardsContainerProps {
  kpiData: {
    dau: number;
    dau_pct_change: number;
    occupancy_rate: number;
    pending_verifications: number;
    total_occupied: number;
    total_users: number;
    remaining_rooms: number;
    remaining_rooms_value: number;
    daily_interests: number;
    interest_pct_change: number;
  };
}

function StatCardsContainer({ kpiData }: StatCardsContainerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Daily Active Users"
        value={kpiData.dau}
        trend={kpiData.dau_pct_change}
        icon={Users}
        trendLabel={
          kpiData.dau_pct_change > 0
            ? `${kpiData.dau_pct_change.toFixed(1)}% higher than yesterday.`
            : `${-kpiData.dau_pct_change.toFixed(1)}% lower than yesterday.`
        }
      />
      <StatCard
        label="Daily Interests"
        value={`${kpiData.daily_interests}`}
        trend={kpiData.interest_pct_change}
        icon={BedDouble}
        trendLabel={
          kpiData.interest_pct_change > 0
            ? `${kpiData.interest_pct_change.toFixed(
                1
              )}% higher than yesterday.`
            : `${kpiData.interest_pct_change.toFixed(1)}% lower than yesterday.`
        }
      />
      <StatCard
        label="Remaining Units Value"
        value={`$${kpiData.remaining_rooms_value}`}
        icon={DollarSign}
        trendLabel={`${kpiData.remaining_rooms} units remaining.`}
      />
      <RouterLink
        to={{ page: "landlords" }}
        className="block transform transition-transform hover:scale-[1.02]"
      >
        <StatCard
          label="Pending Verifications"
          value={kpiData.pending_verifications}
          icon={AlertCircle}
          trendLabel={
            kpiData.pending_verifications > 0
              ? "Action Required"
              : "No Action Required"
          }
        />
      </RouterLink>
    </div>
  );
}

export default StatCardsContainer;
