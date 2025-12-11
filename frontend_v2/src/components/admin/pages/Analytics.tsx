import { infoToast } from "@/lib/toast";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { Download } from "lucide-react";
import Demographics from "../analytics/Demographics";
import useAnalytics from "@/hooks/admin/use-analytics";

function Analytics({ serverData }: AdminPanelComponentProps) {
  const { accessToken } = serverData;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Data Lab
          </h1>
          <p className="text-muted-foreground sm:mt-1 text-sm font-medium">
            Deep dive into platform usage and demographics.
          </p>
        </div>
        {/* <button
          className="h-9 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-foreground rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          onClick={() => infoToast("Feature Coming Soon")}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button> */}
      </div>
      <Demographics accessToken={accessToken} />
    </div>
  );
}

export default Analytics;
