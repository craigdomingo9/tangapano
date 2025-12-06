import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface DauTrendChartProps {
  data: any[];
}

export default function DauTrendChart({ data }: DauTrendChartProps) {
  return (
    <div className="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            Daily Active Users
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Past 2 Weeks
          </p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg border border-white/5 shadow-sm">
          <TrendingUp className="w-4 h-4 text-lapis" />
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* 1. Gradient Definition for the "Glow" Effect */}
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c6291" stopOpacity={0.75} />
                <stop offset="95%" stopColor="#0c6291" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* 2. Minimalist Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />

            {/* 3. Clean Axes (No lines, just text) */}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fontWeight: 500,
              }}
              tickFormatter={(value: any) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              dy={10} // Pushes X-axis labels down slightly
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fontWeight: 500,
              }}
            />

            {/* 4. Custom Hover Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#0c6291",
                strokeWidth: 1,
                strokeDasharray: "4 4", // Dotted cursor line
              }}
            />

            {/* 5. Smooth Curve Area */}
            <Area
              type="monotone" // Makes the line smooth/curved
              dataKey="count"
              stroke="#0c6291"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)" // References the <defs> gradient
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
