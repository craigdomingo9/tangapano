import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import BreadcrumbResolver from "./BreadcrumbResolver"


export default function CustomSidebarInset({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset className="">
      <header className="flex h-16 shrink-0 items-center gap-2 border border-gray-200 min-w-full sticky top-0 z-30 bg-background">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <BreadcrumbResolver />
        </div>
      </header>
      {children}
    </SidebarInset>
  )
}
