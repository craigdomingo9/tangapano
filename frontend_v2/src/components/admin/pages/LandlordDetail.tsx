import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import useListingsAdmin from "@/hooks/admin/use-landlord-manager";
import { AdminPanelComponentProps, AdminPanelParams } from "@/lib/types/admin";
import { RouterLink } from "@/routing/RouterLink";
import { ArrowLeft } from "lucide-react";
import HeaderProfile from "../landlord-detail/HeaderProfile";
import { useState, useTransition } from "react";
import DesktopDetailTable from "../landlord-detail/DesktopDetailTable";
import MobileDetailCard from "../landlord-detail/MobileDetailCard";
import { SuspendLandlordModal } from "../landlord-detail/SuspendLandlordModal";
import { errorToast, successToast } from "@/lib/toast";
import { useRouterPush } from "@/hooks/use-router-push";
import { useRouter } from "next/navigation";
import { loginAsUser } from "@/actions/admin/auth";

function LandlordDetail({
  serverData: { accessToken, user },
  params: { landlordId },
}: AdminPanelComponentProps) {
  const {
    listings,
    landlord,
    listingsIsLoading,
    listingsIsError,
    landlordIsLoading,
    landlordIsError,
    isSuspendingLandlord,
    suspendLandlord,
  } = useListingsAdmin(accessToken, landlordId!!);
  const [isPending, startTransition] = useTransition();
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const { push } = useRouterPush<AdminPanelParams>();
  const router = useRouter();

  async function handleSuspend() {
    if (!landlordId) return errorToast("There was an unexpected error.");
    suspendLandlord();
    setIsSuspendModalOpen(false);
    push({ page: "landlords" });
  }

  function handleLoginAsUser() {
    startTransition(async () => {
      try {
        if (!landlord?.user) throw Error;
        const success = await loginAsUser(landlord?.user as number);

        if (!success) throw Error;

        successToast(
          `You are now logged in ${landlord.full_name ? `as ${landlord.full_name}` : ""
          } for the next hour.`
        );
        router.push("/partner/dashboard");
      } catch {
        const errorMessage = "An unexpected error occurred. Please try again.";
        errorToast(errorMessage);
      }
    });
  }

  if (landlordIsError) return <ErrorPage type="404" />;
  if (landlordIsLoading) return <LoadingScreen />;

  return (
    <>
      <div className="space-y-8 animate-fade-in pb-12 relative">
        {/* Navigation */}
        <RouterLink
          to={{ page: "landlords" }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-lapis transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </RouterLink>

        <HeaderProfile
          landlord={landlord!!}
          user={user}
          setIsSuspendModalOpen={(val: boolean) => setIsSuspendModalOpen(val)}
          handleLoginAsUser={handleLoginAsUser}
          isImpersonating={isPending}
        />
        {/* Portfolio Section (Focus of the page) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground px-1">
            Portfolio Inventory
          </h3>
          {/* Desktop Table */}
          <DesktopDetailTable
            listings={listings}
            isLoading={listingsIsLoading}
            isError={listingsIsError}
          />
          {/* Mobile Card */}
          <MobileDetailCard
            listings={listings}
            isLoading={listingsIsLoading}
            isError={listingsIsError}
          />
        </div>
      </div>
      <SuspendLandlordModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        isSuspending={isSuspendingLandlord}
        onConfirm={handleSuspend}
        landlordName={landlord?.full_name}
      />
    </>
  );
}

export default LandlordDetail;
