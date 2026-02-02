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
import ChangePasswordModal from "../landlord-detail/ChangePasswordModal";
import useAuthAdmin from "@/hooks/admin/use-auth";

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

  // Auth & Password Management
  const { isChangingPassword, changePassword } = useAuthAdmin(accessToken);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
          `You are now logged in ${
            landlord.full_name ? `as ${landlord.full_name}` : ""
          } for the next hour.`,
        );
        router.push("/partner/dashboard");
      } catch {
        const errorMessage = "An unexpected error occurred. Please try again.";
        errorToast(errorMessage);
      }
    });
  }

  async function handlePasswordChange(data: { password: string }) {
    if (!landlord?.username) {
      errorToast("Landlord user account not found.");
      return;
    }

    try {
      await changePassword({
        username: landlord?.username,
        new_password: data.password,
      });
      setIsPasswordModalOpen(false);
    } catch (err) {
      errorToast("Failed to update password. Please try again.");
    }
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

        {/* Profile Header */}
        <HeaderProfile
          landlord={landlord!!}
          user={user}
          setIsSuspendModalOpen={setIsSuspendModalOpen}
          handleLoginAsUser={handleLoginAsUser}
          isImpersonating={isPending}
          // Assuming HeaderProfile accepts this prop to trigger the modal
          // If not, you may need to update HeaderProfile or place a button elsewhere
          setIsPasswordModalOpen={setIsPasswordModalOpen}
        />

        {/* Portfolio Section */}
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

      {/* Modals */}
      <SuspendLandlordModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        isSuspending={isSuspendingLandlord}
        onConfirm={handleSuspend}
        landlordName={landlord?.full_name}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordChange}
        isExecuting={isChangingPassword}
      />
    </>
  );
}

export default LandlordDetail;
