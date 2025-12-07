import useAnalytics from "@/hooks/admin/use-analytics";
import React from "react";

interface TopCampusesProps {
  data: any[];
  isLoading: boolean;
  isError: boolean;
}

function TopCampuses({ data, isLoading, isError }: TopCampusesProps) {
  const max = Math.max(...data.map((item) => item.value));

  const dataNormalized = data.map((item) => ({
    ...item,
    value: ((item.value / max) * 100).toFixed(2),
  }));

  if (!data?.length) return null;
  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl h-full">
      <h3 className="font-bold dark:text-white text-lg text-foreground mb-6 tracking-tight">
        Regional Interest Heatmap
      </h3>
      <div className="space-y-6">
        {dataNormalized.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-500 dark:text-white/70">
                {item.region}
              </span>
              <span className="font-bold text-slate-500 dark:text-white/70">
                {data[idx].value}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-lapis rounded-full shadow-glow"
                style={{
                  width: `${item.value > 0 ? `${item.value}%` : "1%"}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCampuses;
