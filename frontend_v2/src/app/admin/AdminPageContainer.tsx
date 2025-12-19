"use client";

import createEntityStore from "@/lib/stores/entityStore";
import Sidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { useTheme } from "next-themes";
import { RouteRenderer } from "@/routing/RouteRenderer";
import { adminPanelRoutes } from "@/routing/registries/admin";
import { AdminPanelContext } from "@/lib/types/admin";
import { logoutAction } from "@/actions/admin/auth";
import { successToast } from "@/lib/toast";

interface SideBarState {
  collapsed: boolean;
  mobileOpen: boolean;
}

const useSidebar = createEntityStore<{
  collapsed: boolean;
  mobileOpen: boolean;
}>(
  {
    collapsed: false,
    mobileOpen: false,
  } as SideBarState,
  {
    name: "sidebar",
  }
);

function AdminPageContainer({ serverData }: { serverData: AdminPanelContext }) {
  const { entities, setEntities } = useSidebar();
  async function onLogout() {
    await logoutAction();
    successToast("Logged out successfully. Until next time ᕙ(▀̿̿ĺ̯̿̿▀̿ ̿) ᕗ");
  }

  // console.log(serverData);

  function setMobileOpen(open: boolean) {
    setEntities({
      ...entities,
      mobileOpen: open,
    });
  }

  function setCollapsed(collapsed: boolean) {
    setEntities({
      ...entities,
      collapsed: collapsed,
    });
  }

  const { theme, setTheme } = useTheme();
  const isDark = theme?.toLowerCase() == "dark";

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-primary/30 selection:text-primary-foreground transition-colors duration-300">
      <Sidebar
        onLogout={onLogout}
        mobileOpen={entities.mobileOpen}
        collapsed={entities.collapsed}
        setMobileOpen={setMobileOpen}
      />
      <main
        id="main-content"
        className="flex-1 bg-gray-50/50 dark:bg-app-bg overflow-y-auto flex flex-col relative scroll-smooth transition-colors duration-300"
      >
        {/* New Modular Header */}
        <AdminHeader
          mobileMenuOpen={entities.mobileOpen}
          setMobileMenuOpen={setMobileOpen}
          sidebarCollapsed={entities.collapsed}
          setSidebarCollapsed={setCollapsed}
          isDark={isDark}
          toggleTheme={() => setTheme(!isDark ? "dark" : "light")}
        />

        <div className="flex-1 p-4 md:p-8 max-w-[1920px] mx-auto w-full relative z-0">
          <RouteRenderer routes={adminPanelRoutes} serverData={serverData} />
        </div>
      </main>
    </div>
  );
}

export default AdminPageContainer;
