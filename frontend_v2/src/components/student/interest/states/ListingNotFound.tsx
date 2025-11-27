import { AlertCircle, Home, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";

function ListingNotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 px-4">
      {/* Icon Graphic */}
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 bg-app-surface border border-gray-700 rounded-3xl flex items-center justify-center shadow-2xl">
          <Search size={40} className="text-gray-400" />
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-4 border-app-bg">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3 max-w-sm">
        <h2 className="text-2xl font-semibold text-white">Listing Not Found</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          This listing you are looking for is no longer available or has been
          removed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col w-full max-w-xs gap-3">
        <button
          onClick={() => router.push("/student")}
          className="flex items-center justify-center gap-2 w-full py-3 bg-lapis hover:bg-lapis-hover active:bg-lapis-hover text-white font-medium rounded-xl transition-all shadow-lg shadow-lapis-900/20 cursor-pointer"
        >
          <Home size={18} />
          Return to Student Portal
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 w-full py-3 bg-app-surface border border-gray-700 hover:bg-gray-800 text-gray-300 font-medium rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw size={18} />
          Reload Page
        </button>
      </div>

      {/* Footer Helper */}
      <div className="pt-8">
        <p className="text-xs text-gray-600">
          Error Code: 404_RESOURCE_MISSING
        </p>
      </div>
    </div>
  );
}

export default ListingNotFound;
