"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { capitalizeFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";

function BreadcrumbResolver() {
  const path = usePathname();
  const breadcrumb = capitalizeFirstLetter(
    path.split("/").at(-1)?.toString() || "",
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbResolver;
