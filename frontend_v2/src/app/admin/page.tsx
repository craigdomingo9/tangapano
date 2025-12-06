import React, { Suspense } from "react";
import AdminPanelRouter from "./AdminPanelRouter";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";

function page() {
  return (
    <main className="flex flex-col min-h-screen">
      <Suspense fallback={<LoadingScreen />}>
        {/* Pass ONLY data. The routes are handled inside PartnerRouter. */}
        <AdminPanelRouter serverData={{}} params={{}} />
      </Suspense>
    </main>
  );
}

export default page;
