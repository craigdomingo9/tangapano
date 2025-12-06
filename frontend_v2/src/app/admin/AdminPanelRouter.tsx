import { AdminPanelComponentProps } from "@/lib/types/admin";
import { adminPanelRoutes } from "@/routing/registries/admin";
import { RouteRenderer } from "@/routing/RouteRenderer";

function AdminPanelRouter({ serverData }: AdminPanelComponentProps) {
  return <RouteRenderer routes={adminPanelRoutes} serverData={serverData} />;
}

export default AdminPanelRouter;
