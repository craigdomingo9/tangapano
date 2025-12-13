import { Button } from "@/components/ui/button";
import { Globe, Layers } from "lucide-react";

interface IsSatelliteButtonProps {
  isSatellite: boolean;
  setIsSatellite: (state: boolean) => void;
}

function IsSatelliteButton({
  isSatellite,
  setIsSatellite,
}: IsSatelliteButtonProps) {
  return (
    <div className="absolute top-12 right-2 z-5000">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setIsSatellite(!isSatellite)}
        className="shadow-md text-xsm sm:text-sm z-100 bg-white/90 hover:bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800"
      >
        {isSatellite ? (
          <>
            <Layers className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              Standard
            </span>
          </>
        ) : (
          <>
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              Satellite
            </span>
          </>
        )}
      </Button>
    </div>
  );
}

export default IsSatelliteButton;
