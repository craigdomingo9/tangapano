"use client";
import React, { useEffect, useState } from "react";
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouterPush } from "@/hooks/use-router-push";
import { AdminPanelParams } from "@/lib/types/admin";

interface AdminHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  isDark,
  toggleTheme,
}) => {
  const { push } = useRouterPush<AdminPanelParams>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header className="min-h-16 sticky top-0 z-40 w-full flex items-center justify-between px-4 sm:px-6 border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300">
      {/* Left Section: Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 relative z-10 flex-1">
        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all cursor-pointer"
        >
          {!mounted ? (
            <div className="w-5 h-5" />
          ) : isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all group cursor-pointer"
          onClick={() => push({ page: "notifications" })}
        >
          <Bell className="w-5 h-5 group-hover:animate-pulse" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </button>

        {/* Profile Dropdown Trigger */}
        <div className="pl-2 border-l border-border/40 flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full p-px shadow-glow">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <Avatar>
                <AvatarImage src="/morty.jpeg" />
                <AvatarFallback>TP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
