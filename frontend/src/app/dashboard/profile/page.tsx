"use client";
import DashboardHeader from "@/components/dashboard/Header";
import MainContentArea from "@/components/dashboard/MainContentArea";
import LandlordDialog from "@/components/dashboard/profile/LandlordDialog";
import LandlordInfo from "@/components/dashboard/profile/LandlordInfo";
import UserDialog from "@/components/dashboard/profile/UserDialog";
import UserInfo from "@/components/dashboard/profile/UserInfo";

function page() {
  return (
    <>
      <div className="flex justify-center bg-neutral-100 dashboardFullHeight overflow-y-auto">
        <div className="h-1"></div>
        <div className="px-2 md:px-14 max-w-4xl w-full [&>div]:w-full flex-1 [&>div]:px-2 flex flex-col gap-y-6 sm:gap-y-10">
          <DashboardHeader
            HeaderText={{
              title: "Profile",
              description: "Manage your personal and landlord account details.",
            }}
          />

          <MainContentArea className="flex flex-col gap-4">
            <UserInfo />
            <LandlordInfo />
            <div className="h-12 border border-transparent"></div>
          </MainContentArea>
        </div>
      </div>

      {/* Dialogs */}
      <UserDialog />
      <LandlordDialog />
    </>
  );
}

export default page;
