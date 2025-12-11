"use client";

import { AdminPanelComponentProps } from "@/lib/types/admin";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import StatCardsContainer from "../dashboard/StatCardsContainer";
import useDashboardAnalytics from "@/hooks/admin/use-dashboard";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import DauTrendChart from "../dashboard/DauTrendChart";
import OccupancyDonutChart from "../dashboard/OccupancyDonutChart";
import HotPropertiesTable from "../dashboard/HotPropertiesTable";
import { errorToast, infoToast } from "@/lib/toast";
import { getBriefAdmin } from "@/lib/ai/admin/brief";

function Dashboard({ serverData }: AdminPanelComponentProps) {
  const { accessToken } = serverData;
  const [isPending, startTransition] = useTransition();
  const [AIBrief, setAIBrief] = useState<string | null>(null);

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

  async function generateBrief() {
    startTransition(async () => {
      try {
        const response = await getBriefAdmin({
          kpis,
          dauChartData,
          hotProperties,
        });

        if (!response) throw Error;
        setAIBrief(response);
        console.log(response);
      } catch (error) {
        errorToast("An unexpected error occurred. Please try again.");
      }
    });
  }

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
          onClick={generateBrief}
          className="group relative inline-flex items-center justify-center gap-2 rounded-full text-xsm sm:text-sm font-semibold bg-lapis text-white hover:bg-lapis/90 transition-all h-10 px-6 shadow-lg shadow-lapis/20 overflow-hidden disabled:opacity-50 border border-white/10 cursor-pointer"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>
            {isPending ? "Processing Intelligence..." : "Generate AI Brief"}
          </span>
        </button>
      </div>
      {/* AI Insight Section: Later */}
      {AIBrief && (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-lapis/10 to-background border border-lapis/20 shadow-lg animate-scale-in">
          <div className="relative p-6 flex gap-5">
            <div className="p-3 bg-lapis/20 text-lapis rounded-xl h-fit shadow-inner hidden sm:block">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2 uppercase">
                <span className="sm:hidden text-lapis">
                  <Sparkles className="w-4 h-4" />
                </span>
                AI Executive Summary
              </h3>
              <div className="prose prose-sm text-sm max-w-none text-muted-foreground leading-relaxed font-medium">
                {AIBrief}
              </div>
            </div>
          </div>
        </div>
      )}

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
