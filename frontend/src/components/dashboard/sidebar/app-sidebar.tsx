"use client";
import { Bed, Building2, Command, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Listings",
    url: "/dashboard/listings",
    icon: Building2,
  },
  {
    title: "Rooms",
    url: "/dashboard/rooms",
    icon: Bed,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/icon0.svg"
                    alt="TangaPano Logo"
                    className="scale-150"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">TangaPano</span>
                  <span className="truncate text-xs">Business</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const pathnameSplit = pathname.trim().split("/");

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={
                      pathnameSplit.includes(item.title.toLowerCase())
                        ? "bg-[var(--air-force-blue)] text-white rounded-md"
                        : ""
                    }
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        onClick={() => {
                          if (isMobile) toggleSidebar();
                        }}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="size-6" strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
