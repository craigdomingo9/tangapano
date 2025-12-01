"use client";

import { RouteRenderer } from "@/routing/RouteRenderer";
import { partnerRoutes } from "@/routing/registries/partner"; // Import registry HERE
import { PartnerContext } from "@/lib/types/partner";

interface Props {
  serverData: PartnerContext;
}

export default function PartnerRouter({ serverData }: Props) {
  // Now we pass the routes from Client -> Client. This is safe.
  return <RouteRenderer routes={partnerRoutes} serverData={serverData} />;
}
