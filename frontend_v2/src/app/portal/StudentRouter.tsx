"use client";
import { StudentComponentProps, StudentContext } from "@/lib/types/student";
import { studentRoutes } from "@/routing/registries/student";
import { RouteRenderer } from "@/routing/RouteRenderer";

function StudentRouter({ serverData }: StudentComponentProps) {
  return <RouteRenderer routes={studentRoutes} serverData={serverData} />;
}

export default StudentRouter;
