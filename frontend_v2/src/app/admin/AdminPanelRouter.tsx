"use client";

import SidebarContainer from "@/components/admin/SidebarContainer";
import { AdminPanelComponentProps } from "@/lib/types/admin";
import { adminPanelRoutes } from "@/routing/registries/admin";
import { RouteRenderer } from "@/routing/RouteRenderer";

export function AdminPanelRouter({
  serverData,
  params,
}: AdminPanelComponentProps) {
  const { page } = params;

  // console.log(page);
  return (
    <>
      {page !== "login" && <SidebarContainer />}
      <RouteRenderer routes={adminPanelRoutes} serverData={serverData} />
    </>
  );
}

export default AdminPanelRouter;
