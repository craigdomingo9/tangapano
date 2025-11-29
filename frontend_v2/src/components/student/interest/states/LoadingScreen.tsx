import { Building2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 animate-in fade-in duration-500">
      {/* Visual Loader Container */}
      <div className="relative mb-10">
        {/* Ambient Glow - Pulse Effect */}
        <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 blur-3xl rounded-full animate-pulse" />

        {/* Spinner Assembly */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Track Ring (Background) */}
          <div className="absolute inset-0 border-[3px] border-slate-100 dark:border-slate-800 rounded-full" />

          {/* Outer Spinner (Clockwise) */}
          <div className="absolute inset-0 border-[3px] border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-[spin_3s_linear_infinite]" />

          {/* Inner Spinner (Counter-Clockwise) */}
          <div className="absolute inset-3 border-[3px] border-transparent border-b-violet-500 dark:border-b-violet-400 rounded-full animate-[spin_2s_linear_infinite_reverse]" />

          {/* Center Icon Platform */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 z-10">
              <Building2
                className="text-indigo-600 dark:text-indigo-400"
                size={20}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-3 z-10">
        <h3 className="text-slate-900 dark:text-white font-medium text-base tracking-tight animate-pulse">
          Loading View...
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest">
          Please Wait
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
