import React from "react";
import StatCard from "../dashboard/StatCard";
import { Bed, Eye, MessageCircle } from "lucide-react";
import { Inventory } from "@/lib/api/admin/inventory";

interface InventoryStatsProps {
  listing: Inventory;
}

function InventoryStats({ listing }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Views"
        value={listing?.stats.total_views.toString()!!}
        icon={Eye}
      />
      <StatCard
        label="Inquiries"
        value={listing?.stats.total_inquiries.toString()!!}
        icon={MessageCircle}
      />
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2.5 bg-lapis/20 text-lapis rounded-lg shadow-sm">
            <Bed className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide mb-1">
            Vacancy
          </h3>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {listing?.vacancy_stats?.total!! - listing?.vacancy_stats.filled!!}{" "}
            <span className="text-sm text-muted-foreground font-normal">
              / {listing?.vacancy_stats.total} beds
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default InventoryStats;
