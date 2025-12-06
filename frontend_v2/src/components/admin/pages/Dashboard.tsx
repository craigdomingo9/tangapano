"use client";

import { AdminPanelComponentProps } from "@/lib/types/admin";
import {
  AlertCircle,
  BedDouble,
  Calendar,
  DollarSign,
  Home,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import StatCard from "../dashboard/StatCard";
import { RouterLink } from "@/routing/RouterLink";
import StatCardsContainer from "../dashboard/StatCardsContainer";
import useDashboardAnalytics from "@/hooks/admin/use-dashboard-analytics";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import DauTrendChart from "../dashboard/DauTrendChart";
import OccupancyDonutChart from "../dashboard/OccupancyDonutChart";
import HotPropertiesTable from "../dashboard/HotPropertiesTable";
import { infoToast } from "@/lib/toast";

function Dashboard({ serverData }: AdminPanelComponentProps) {
  const { accessToken } = serverData;
  const [loadingInsight, setLoadingInsight] = useState(false);

  const {
    kpis,
    kpiIsLoading,
    kpiIsError,
    dauChartData,
    chartIsLoading,
    dauChartIsError,
    hotProperties,
    hotPropertiesIsLoading,
    hotPropertiesIsError,
  } = useDashboardAnalytics(accessToken);

  if (kpiIsLoading) return <LoadingScreen />;
  if (kpiIsError) return <ErrorPage type="404" />;

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Mission Control
          </h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground font-medium text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            infoToast("Feature coming soon!");
          }}
          className="group relative inline-flex items-center justify-center gap-2 rounded-full text-xsm sm:text-sm font-semibold bg-lapis text-white hover:bg-lapis/90 transition-all h-10 px-6 shadow-lg shadow-primary/20 overflow-hidden disabled:opacity-50 border border-white/10 cursor-pointer"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {loadingInsight ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>
            {loadingInsight
              ? "Processing Intelligence..."
              : "Generate AI Brief"}
          </span>
        </button>
      </div>
      {/* AI Insight Section: Later */}

      {/* Stats Grid - Top Row IDD */}
      <StatCardsContainer kpiData={kpis} />

      {/* Main Layout - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DauTrendChart data={dauChartData} />
        <OccupancyDonutChart
          remaining_rooms={kpis.remaining_rooms}
          available_rooms={kpis.total_occupied}
          occupancy_rate={kpis.occupancy_rate}
        />
      </div>
      <HotPropertiesTable hotProperties={hotProperties} />
    </div>
  );
}

export default Dashboard;
