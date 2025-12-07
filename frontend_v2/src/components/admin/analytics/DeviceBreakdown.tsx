import { Monitor, Smartphone } from "lucide-react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

interface DeviceBreakdownProps {
  data: { name: string; value: number }[];
  isLoading: boolean;
  isError: boolean;
}

function DeviceBreakdown({ data, isLoading, isError }: DeviceBreakdownProps) {
  const PRIMARY_COLOR = "#0c6291";
  const SECONDARY_COLOR = "#4b89ab";

  const total = data?.reduce((acc, item) => acc + item.value, 0);

  const mobilePercentage = Math.round((data?.[0].value / total) * 100);
  const desktopPercentage = Math.round((data?.[1].value / total) * 100);

  if (!data?.length) return null;
  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
      <h3 className="font-bold text-lg text-foreground mb-1 tracking-tight">
        Device Breakdown
      </h3>
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        Platform access points
      </p>

      <div className="flex-1 min-h-[220px] relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              <Cell key="cell-0" fill={PRIMARY_COLOR} />
              <Cell key="cell-1" fill={SECONDARY_COLOR} />
              <Label
                value={`${desktopPercentage}%`}
                position="center"
                className="text-2xl font-bold fill-foreground"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-8 pt-4 text-xsm sm:text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: SECONDARY_COLOR }}
          />
          <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <Smartphone className="w-4 h-4" /> Mobile ({mobilePercentage}%)
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: PRIMARY_COLOR }}
          />
          <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <Monitor className="w-4 h-4" /> Desktop ({desktopPercentage}%)
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceBreakdown;
