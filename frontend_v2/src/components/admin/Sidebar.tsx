import React, { useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building,
  Bell,
  Shield,
  LogOut,
  X,
  Wallet,
  Map,
  Tag,
  UserCheck,
  Home,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RouterLink } from "@/routing/RouterLink";
import useIsMobile from "@/hooks/use-is-mobile";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const isActive = (path: string) => page === path;
  const { isMobile } = useIsMobile();

  useEffect(() => {
    // console.log("VIEWPORT", isMobile);
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const navItems = [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
        { label: "Analytics", icon: BarChart3, page: "analytics" },
      ],
    },
    {
      group: "User Management",
      items: [
        { label: "Landlords", icon: Users, page: "landlords" },
        { label: "Agents", icon: UserCheck, page: "agents" },
      ],
    },
    {
      group: "Listings",
      items: [
        { label: "Inventory", icon: Building, page: "listings" },
        { label: "Inquiries", icon: MessageSquare, page: "inquiries" },
      ],
    },
    {
      group: "System",
      items: [
        { label: "Locations & Amenities", icon: Map, page: "locations" },
        { label: "Notifications", icon: Bell, page: "notifications" },
      ],
    },
  ];

  const mobileClasses = mobileOpen
    ? "fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 translate-x-0 shadow-2xl bg-card"
    : "fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 -translate-x-full md:relative md:translate-x-0 md:shadow-none md:bg-transparent";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      <aside
        className={`${mobileClasses} ${!mobileOpen ? "hidden" : ""} md:flex ${
          !mobileOpen && !collapsed ? "md:w-72" : ""
        } ${
          collapsed ? "md:w-20" : ""
        } h-screen overflow-y-auto flex-col transition-all z-50 border-r border-border/40 bg-card animate-in fade-in slide-in-from-left-4 duration-700 fill-mode-both`}
        key={collapsed ? "collapsed" : "expanded"}
      >
        {/* Logo Section */}
        <div
          className={`h-20 flex flex-col justify-center ${
            collapsed ? "items-center" : "items-start px-6"
          } transition-all border-b border-border/40`}
        >
          {!collapsed || mobileOpen ? (
            <div className="flex flex-col self-start animate-fade-in">
              <span className="text-xl font-bold tracking-tight text-foreground leading-none">
                <span className="text-red-500/80">Tanga</span>Pano
              </span>
              <span className="text-xxs text-primary font-semibold tracking-widest uppercase mt-1">
                Control Panel
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              T
            </div>
          )}

          {mobileOpen && (
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="absolute top-6 right-6 md:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-3 space-y-8">
          {navItems.map((group, idx) => (
            <div key={idx}>
              {(!collapsed || mobileOpen) && (
                <h3 className="px-3 mb-3 text-xxs font-bold text-muted-foreground uppercase tracking-widest">
                  {group.group}
                </h3>
              )}
              <nav className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active = isActive(item.page);
                  return (
                    <RouterLink
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                        ${
                          active
                            ? "bg-lapis dark:bg-sky-500/90 dark:text-white/90 text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      key={item.page}
                      to={{ page: item.page }}
                    >
                      <item.icon
                        className={`w-4 h-4 shrink-0 transition-colors relative z-10 ${
                          active
                            ? "text-primary-foreground dark:text-white/90"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      {(!collapsed || mobileOpen) && (
                        <span className="whitespace-nowrap relative z-10">
                          {item.label}
                        </span>
                      )}
                    </RouterLink>
                  );
                })}
              </nav>
            </div>
          ))}
          {/* Footer */}
          <div className="p-4 border-t border-border/40">
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-start gap-3 px-3"
              } py-3 w-full cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 group`}
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {(!collapsed || mobileOpen) && (
                <span className="whitespace-nowrap">Sign Out</span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
