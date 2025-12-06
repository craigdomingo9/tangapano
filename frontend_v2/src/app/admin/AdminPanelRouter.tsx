"use client";

import AdminPageContainer from "@/app/admin/AdminPageContainer";
import { AdminPanelComponentProps, AdminPanelContext } from "@/lib/types/admin";
import { adminPanelRoutes } from "@/routing/registries/admin";
import { RouteRenderer } from "@/routing/RouteRenderer";

export function AdminPanelRouter({
  serverData,
  params,
}: AdminPanelComponentProps) {
  const { page } = params;

  // console.log(page);
  if (page === "login")
    return (
      <RouteRenderer
        routes={adminPanelRoutes}
        serverData={{} as AdminPanelContext}
      />
    );
  return (
    <>
      <AdminPageContainer serverData={serverData} />
    </>
  );
}

export default AdminPanelRouter;
