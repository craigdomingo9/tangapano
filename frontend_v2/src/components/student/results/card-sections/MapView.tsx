import { GraduationCap, Link, MapPin } from "lucide-react";

interface MapViewProps {
  listing: Listing;
}

function MapView({ listing }: MapViewProps) {
  return (
    <div className="w-full h-full relative bg-[#e5e7eb] dark:bg-app-input flex items-center justify-center overflow-hidden animate-in fade-in duration-300">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Connecting Line (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Curved path from top-right to bottom-left */}
        <path
          d="M 75% 30% Q 50% 30% 25% 65%"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeDasharray="8 4"
          fill="none"
          className="animate-pulse"
        />
      </svg>

      {/* Campus Pin (Top Right) */}
      <div className="absolute top-[20%] right-[15%] flex flex-col items-center group/pin z-10">
        <div className="relative">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 text-crimson">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rotate-45"></div>
        </div>
        <div className="mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-xxs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Campus
          </p>
        </div>
      </div>

      {/* Property Pin (Bottom Left) */}
      <div className="absolute bottom-[25%] left-[15%] flex flex-col items-center group/pin z-10">
        <div className="relative">
          <div className="w-10 h-10 bg-lapis text-white rounded-full flex items-center justify-center shadow-lg shadow-lapis/30 border-2 border-white dark:border-slate-700 animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 max-w-[120px] text-center">
          <p className="text-xxs font-bold text-slate-900 dark:text-slate-100 truncate">
            {listing.title}
          </p>
        </div>
      </div>

      {/* Distance Badge (Center) */}
      <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2.5 py-1 rounded-full shadow-xl flex items-center gap-1.5 border border-white/20">
          <Link className="w-3 h-3" />
          <span className="text-xs font-bold whitespace-nowrap">
            {listing.distance_from_campus} min
          </span>
        </div>
      </div>
    </div>
  );
}

export default MapView;
