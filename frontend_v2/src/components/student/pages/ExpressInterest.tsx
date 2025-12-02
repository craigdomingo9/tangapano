import { StudentComponentProps, StudentParams } from "@/lib/types/student";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../interest/states/LoadingScreen";
import ListingNotFound from "../interest/states/ListingNotFound";
import { fetchListingById } from "@/lib/api/listings";
import { FullScreenView } from "@/components/ui/FullScreenView";
import ThemeToggle from "@/components/ui/ThemeToggle";
import StepsOrchestrator from "../interest/StepsOrchestrator";
import { useRouterPush } from "@/hooks/use-router-push";
import { UnsavedChangesModal } from "@/components/partner/dashboard/UnsavedChangesModal";
import { useState } from "react";
import { useExpressInterestStore } from "@/lib/stores/expressInterestStore";
import { useSearchParams } from "next/navigation";

function ExpressInterest({ params, serverData }: StudentComponentProps) {
  const { listingId } = params;
  const {
    data: listing,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetchListingById(listingId!!),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 20,
  });
  const { push } = useRouterPush<StudentParams>();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const { reset } = useExpressInterestStore();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") ?? "1", 10);

  if (isLoading) return <LoadingScreen />;
  if (isError || !listing || !listingId) return <ListingNotFound />;

  console.log(listing);

  function handleDiscard() {
    reset();
    setShowUnsavedModal(false);
    push({ page: "home" });
  }

  function handleSave() {
    setShowUnsavedModal(false);
    push({ page: "home" });
  }

  function handleOnBack() {
    if (currentStep === 1) {
      push({ page: "home" });
      return;
    }
    setShowUnsavedModal(true);
  }

  return (
    <FullScreenView
      title={`Express Interest ${isSuccess && "in " + listing.title}`}
      onBack={handleOnBack}
      action={<ThemeToggle className="text-slate-900 dark:text-white/80" />}
    >
      <StepsOrchestrator listing={listing} />
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={false}
      />
    </FullScreenView>
  );
}

export default ExpressInterest;
