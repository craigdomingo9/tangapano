import React, { Suspense } from "react";
import AdminPanelRouter from "./AdminPanelRouter";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { cookies } from "next/headers";
import { getUser } from "@/lib/api/user-context";
import { redirect } from "next/navigation";
import { AdminPanelContext } from "@/lib/types/admin";

async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const params = await searchParams;
  const { page } = params;

  const user = await getUser({ isAdmin: true });
  // console.log(user, page);

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
