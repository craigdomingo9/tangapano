import { Suspense } from "react";
import { RouteRenderer } from "@/routing/RouteRenderer";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { getUser } from "@/lib/api/user-context";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PartnerContext } from "@/lib/types/partner";
import { partnerRoutes } from "@/routing/registries/partner";
import PartnerRouter from "./PartnerRouter";
import { USER_COOKIE_NAME } from "@/constants/auth";

export const metadata = {
  title: "Dashboard - Partner Portal",
  description: "Manage your properties",
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;

  // 1. Fetch on Server (Reliable, uses Cookies)
  const user = await getUser();
  // console.log(user);

  if (!user || !token) redirect("/partner/login");

  if (user.role !== "landlord") {
    redirect("/partner/login");
  }

  // 2. Construct the Context
  const serverContext: PartnerContext = {
    user: user,
    accessToken: token,
  };

  // 3. Render
  return (
    <main className="flex flex-col min-h-screen">
      <Suspense fallback={<LoadingScreen />}>
        {/* Pass ONLY data. The routes are handled inside PartnerRouter. */}
        <PartnerRouter serverData={serverContext} />
      </Suspense>
    </main>
  );
}
