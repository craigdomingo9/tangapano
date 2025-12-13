import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Info, Locate } from "lucide-react";
import { useState } from "react";
import { ListingFormState } from "../pages/ListingManagement";

interface LocationCaptureProps {
  listing: ListingFormState;
  handleChange: (key: keyof ListingFormState, value: any) => void;
}

function LocationCapture({ listing, handleChange }: LocationCaptureProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualCoords, setShowManualCoords] = useState(false);

  const handleDetectLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    // 1. Guard against Server-Side Rendering (Next.js)
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    // 2. Timeout Id for cleanup (Optional but good practice)
    const timeoutId = setTimeout(() => {
      // If permission prompt hangs for too long, you might want to warn user
      // "Please allow location access..."
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);

        // 3. Batch Updates (Pseudocode - depends on your form handler)
        // Ideally update both at once to prevent "half-valid" state
        handleChange("location", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setIsLocating(false);

        // 4. UX FIX: Do NOT hide manual coords.
        // Open them so the user can see/verify/tweak the result.
        setShowManualCoords(true);
      },
      (error) => {
        clearTimeout(timeoutId);

        let msg = "Unable to retrieve location.";
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            msg =
              "Permission denied. Please enable location services in your browser settings.";
            break;
          case 2: // POSITION_UNAVAILABLE
            msg = "Location information is unavailable.";
            break;
          case 3: // TIMEOUT
            msg =
              "Location request timed out. Please try entering coordinates manually.";
            break;
          default:
            msg = error.message || "An unknown error occurred.";
        }

        setLocationError(msg);
        setIsLocating(false);
        setShowManualCoords(true); // Ensure they can type it in
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased to 15s to give GPS a chance
        maximumAge: 0,
      }
    );
  };

  const hasCoords = listing?.location.latitude && listing?.location.longitude;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 transition-all duration-300 bg-white dark:bg-slate-900",
        hasCoords
          ? "border-emerald-100 dark:border-emerald-900/30 shadow-sm"
          : "border-dashed border-slate-300 dark:border-slate-700"
      )}
    >
      <div className="p-5 flex flex-col items-center text-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors",
            isLocating
              ? "bg-lapis/10 text-lapis dark:text-sky-400"
              : hasCoords
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          )}
        >
          {isLocating ? (
            <p>Loading...</p>
          ) : hasCoords ? (
            <Check className="w-5 h-5" />
          ) : (
            <Locate className="w-5 h-5" />
          )}
        </div>

        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
          {hasCoords ? "GPS Coordinates Pinned" : "Pin Exact Location"}
        </h4>

        {hasCoords ? (
          <div className="my-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
            <code className="text-xs text-slate-600 dark:text-slate-300 font-mono tracking-tight">
              {listing?.location.latitude?.toFixed(6)},{" "}
              {listing?.location.longitude?.toFixed(6)}
            </code>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px] mt-1 mb-4 leading-relaxed">
            Capture GPS coordinates to help students navigate to your property
            accurately.
          </p>
        )}

        <div className="flex flex-wrap gap-2 justify-center mt-2 w-full">
          <Button
            type="button"
            size="sm"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className={cn(
              "h-9 text-xs font-bold transition-all",
              hasCoords
                ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                : "bg-lapis hover:bg-lapis-hover text-white shadow-md shadow-lapis/20 w-full sm:w-auto"
            )}
          >
            {isLocating
              ? "Detecting..."
              : hasCoords
              ? "Update Location"
              : "Use Current Location"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowManualCoords(!showManualCoords)}
            className="h-9 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {showManualCoords ? "Hide Inputs" : "Enter Manually"}
          </Button>
        </div>

        {locationError && (
          <div className="mt-3 p-2 w-full rounded bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex items-center gap-2 text-left">
            <Info className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <p className="text-xxs text-red-600 dark:text-red-400 font-medium leading-tight">
              {locationError}
            </p>
          </div>
        )}
      </div>

      {/* Manual Input Expansion */}
      {showManualCoords && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xxs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={listing?.location.latitude ?? ""}
                onChange={(e) =>
                  handleChange("location", {
                    longitude: listing.location.longitude,
                    latitude: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono focus:border-lapis dark:focus:border-sky-500 outline-none transition-all"
                placeholder="-17.82"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xxs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={listing?.location.longitude ?? ""}
                onChange={(e) =>
                  handleChange("location", {
                    latitude: listing.location.latitude,
                    longitude: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono focus:border-lapis dark:focus:border-sky-500 outline-none transition-all"
                placeholder="31.05"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationCapture;
