import { Suspense } from "react";
import AdminPanelRouter from "./AdminPanelRouter";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { cookies } from "next/headers";
import { getAdminUser } from "@/lib/api/user-context";
import { redirect } from "next/navigation";
import { AdminPanelContext } from "@/lib/types/admin";
import { Metadata } from "next";
import { ADMIN_COOKIE_NAME } from "@/constants/auth";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  landlords: "Landlords",
  agents: "Agents",
  inventory: "Inventory",
  inquiries: "Inquiries",
  locations: "Locations",
  notifications: "Notifications",
};

type Props = {
  params: { [key: string]: string | string[] | undefined }; // standard route params
  searchParams: { [key: string]: string | string[] | undefined }; // query strings
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const query = await searchParams;

  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;

  const pageTitle =
    "TangaPano | " +
    (pageParam && PAGE_TITLES[pageParam]
      ? PAGE_TITLES[pageParam]
      : "Dashboard");

  return {
    title: pageTitle,
    icons: {
      icon: "/morty.jpeg",
    },
  };
}

async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const params = await searchParams;
  const { page } = params;

  const user = await getAdminUser();

  if ((!user || !token) && page !== "login") redirect("/admin?page=login");

  const serverContext: AdminPanelContext = {
    user: user!!,
    accessToken: token!!,
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <AdminPanelRouter serverData={serverContext} params={params} />
      </Suspense>
    </main>
  );
}

export default page;
