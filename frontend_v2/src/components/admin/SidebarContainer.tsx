"use client";

import { logoutAction } from "@/actions/partner/auth";
import createEntityStore from "@/lib/stores/entityStore";
import Sidebar from "./Sidebar";

interface SideBarState {
  collapsed: boolean;
  mobileOpen: boolean;
}

const useSidebar = createEntityStore<{
  collapsed: boolean;
  mobileOpen: boolean;
}>(
  {
    collapsed: true,
    mobileOpen: false,
  } as SideBarState,
  {
    name: "sidebar",
  }
);

function SidebarContainer() {
  const { entities, setEntities } = useSidebar();
  async function onLogout() {
    await logoutAction();
  }

  function setMobileOpen(open: boolean) {
    setEntities({
      ...entities,
      mobileOpen: open,
    });
  }

  //   console.log(entities.mobileOpen, entities.collapsed);

  return (
    <Sidebar
      onLogout={() => onLogout()}
      mobileOpen={entities.mobileOpen}
      setMobileOpen={setMobileOpen}
    />
  );
}

export default SidebarContainer;
