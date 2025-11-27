import { Building2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 animate-fade-in">
      {/* Visual Loader */}
      <div className="relative mb-8">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse-slow" />

        {/* Spinner Ring */}
        <div className="w-24 h-24 border-4 border-gray-800/50 rounded-full relative shadow-2xl">
          <div className="absolute inset-0 border-t-4 border-lapis rounded-full animate-spin"></div>
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="text-indigo-400/80" size={32} />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-2 max-w-xs mx-auto">
        <h3 className="text-white font-medium text-lg tracking-tight">
          Loading Listing
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Please wait while we verify availability and fetch property details...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
