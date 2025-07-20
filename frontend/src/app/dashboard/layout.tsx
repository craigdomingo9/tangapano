import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "@/components/Sonner";
import { AuthProvider } from "../context/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CustomSidebarInset from "@/components/dashboard/sidebar/sidebar-inset";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";

export const metadata: Metadata = {
  title: "TangaPano Dashboard",
  description: "Manage your listings with ease!",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          <CustomSidebarInset children={children} />
          <Toaster />
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}


