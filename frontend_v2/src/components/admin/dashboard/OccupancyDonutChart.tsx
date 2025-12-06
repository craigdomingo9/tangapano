import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PieChartIcon } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

interface OccupancyDonutChartProps {
  remaining_rooms: number;
  available_rooms: number;
  occupancy_rate: number;
}

function OccupancyDonutChart({
  remaining_rooms,
  available_rooms,
  occupancy_rate,
}: OccupancyDonutChartProps) {
  const OCCUPANCY_DATA = [
    {
      name: "Available",
      value: (available_rooms / (remaining_rooms + available_rooms)) * 100,
      fill: "#4b89ab",
    },
    {
      name: "Occupied",
      value: (remaining_rooms / (remaining_rooms + available_rooms)) * 100,
      fill: "#0c6291",
    },
  ];
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="font-bold text-lg text-foreground tracking-tight">
            Occupancy
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Real-time availability
          </p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
          <PieChartIcon className="w-4 h-4 text-secondary" />
        </div>
      </div>

      <div className="flex-1 relative min-h-[250px] z-10 text-sm">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={OCCUPANCY_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={6}
              stroke="none"
            >
              {OCCUPANCY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-2xl font-bold text-foreground">
            {occupancy_rate}%
          </span>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Occupied
          </span>
        </div>
      </div>
    </div>
  );
}

export default OccupancyDonutChart;
