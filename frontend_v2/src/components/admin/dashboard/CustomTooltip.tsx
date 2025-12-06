const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)]">
        <p className="text-xxs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {new Date(label).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full shadow-[0_0_8px_#0c6291]"
            style={{ backgroundColor: "#0c6291" }}
          />
          <span className="text-foreground font-bold text-lg font-mono">
            {payload[0].value.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground font-medium ml-1">
            users
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
