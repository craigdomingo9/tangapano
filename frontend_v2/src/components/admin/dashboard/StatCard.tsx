import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
}) => {
  const isPositive = trend && trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-lapis/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-2 sm:mb-3">
        {/* Icon with solid brand background for best contrast in both light/dark modes */}
        <div className="p-2.5 bg-lapis text-primary-foreground dark:text-white/80 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
          {Icon && <Icon className="size-4 sm:size-4.5" />}
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20"
                : isNeutral
                ? "bg-slate-500/10 text-slate-600 dark:text-slate-500 border border-slate-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : isNeutral ? (
              <Minus className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xsm sm:text-sm font-medium text-muted-foreground tracking-wide mb-1">
          {label}
        </h3>
        <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {value}
        </span>
      </div>

      {trendLabel && (
        <p className="text-xs text-muted-foreground mt-2 opacity-80">
          {trendLabel}
        </p>
      )}
    </div>
  );
};

export default StatCard;
