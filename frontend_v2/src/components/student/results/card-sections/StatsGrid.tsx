import { Home, Link } from "lucide-react";

interface StatsGridProps {
  roomsCount: number;
  distanceFromCampus: number;
}

export default function StatsGrid({
  roomsCount,
  distanceFromCampus,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatBlock
        icon={<Home className="w-4 sm:w-5 h-4 sm:h-5" />}
        value={`${roomsCount} Rooms Available`}
        label="CAPACITY"
      />
      <StatBlock
        icon={<Link className="w-4 sm:w-5 h-4 sm:h-5" />}
        value={`${distanceFromCampus} mins`}
        label="TO CAMPUS"
      />
    </div>
  );
}

interface StatBlockProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatBlock({ icon, value, label }: StatBlockProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-lapis/10 dark:bg-sky-500/10 flex items-center justify-center text-lapis dark:text-sky-400 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-slate-900 dark:text-slate-200 font-bold text-xsm sm:text-sm truncate">
          {value}
        </span>
        <span className="text-slate-400 dark:text-slate-500 text-xxs font-bold uppercase tracking-wider truncate">
          {label}
        </span>
      </div>
    </div>
  );
}
