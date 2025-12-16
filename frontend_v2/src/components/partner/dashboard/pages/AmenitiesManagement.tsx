"use client";
import { FullScreenView } from "@/components/ui/FullScreenView";
import { useRouterPush } from "@/hooks/use-router-push";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorPage } from "../overview/ErrorPage";
import AmenitiesSelectorGrid from "../amenities/AmenitiesSelectorGrid";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { useAmenities, useListingDetail } from "@/hooks/use-reference-data";
import { updateAmenities } from "@/lib/api/listings";
import { errorToast, successToast } from "@/lib/toast";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { UnsavedChangesModal } from "../UnsavedChangesModal";
import { PartnerComponentProps, PartnerParams } from "@/lib/types/partner";

function AmenitiesManagement({ params, serverData }: PartnerComponentProps) {
  // Hooks
  const { push } = useRouterPush<PartnerParams>();
  const queryClient = useQueryClient();
  const { listingId } = params;
  const { accessToken } = serverData;

  // Hook 1: Fetch Amenities
  const { data: availableAmenities } = useAmenities({ has_listings: false });

  // Hook 2: Fetch Listing (Pass enabled: false if ID is missing)
  const { data: listing, isLoading } = useListingDetail(listingId!);

  // Hook 3: Local State
  const [localSelectedIds, setLocalSelectedIds] = useState<(number | string)[]>(
    []
  );

  // Track Modal Visibility
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // 1. Calculate "Dirty" State
  // We check if local state differs from server state
  const hasUnsavedChanges = useMemo(() => {
    if (!listing?.amenities) return localSelectedIds.length > 0;

    const serverIds = listing.amenities.map((a: any) => a.id).sort();
    const localIds = [...localSelectedIds].sort();

    if (serverIds.length !== localIds.length) return true;
    return !serverIds.every(
      (val: any, index: number) => val === localIds[index]
    );
  }, [listing, localSelectedIds]);

  // Hook 4: Effect
  useEffect(() => {
    if (listing?.amenities) {
      // Create a comparison string to see if data actually differs
      const serverIds = listing.amenities
        .map((a: any) => a.id)
        .sort()
        .join(",");
      const localIds = localSelectedIds.sort().join(",");

      // Only update local state if the server data is genuinely different
      // This prevents unnecessary re-renders or reverts during race conditions
      if (serverIds !== localIds) {
        setLocalSelectedIds(listing.amenities.map((a: any) => a.id));
      }
    }
    // We intentionally exclude localSelectedIds from dependency array
    // to prevent loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing]);

  // Hook 5: Mutation
  const mutation = useMutation({
    mutationFn: (ids: (number | string)[]) =>
      updateAmenities(listingId!, ids, accessToken),
    onSuccess: (_, variables) => {
      successToast("Amenities updated successfully");
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });

      // 1. Manually inject the new data into the cache
      queryClient.setQueryData(["listing", listingId], (oldListing: any) => {
        if (!oldListing) return oldListing;

        // We need to convert the list of IDs back into a list of Objects
        // so the cache shape matches what the UI expects.
        const newAmenitiesObjects =
          availableAmenities?.filter((amenity: Amenity) =>
            variables.includes(amenity.id)
          ) || [];

        return {
          ...oldListing,
          amenities: newAmenitiesObjects,
        };
      });
      // 2. Schedule a refetch for safety (eventual consistency)
      // Even if this returns old data for a split second, the UI won't flicker
      // because setQueryData already updated it.
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      // If we were trying to leave, now we can leave
      if (showUnsavedModal) {
        setShowUnsavedModal(false);
      }
      push({ page: "overview" });
    },
    onError: () => {
      errorToast("Failed to update amenities");
    },
  });

  // Early returns
  if (!accessToken) return <ErrorPage type="access" />;
  if (!listingId) return null;
  if (isLoading) return <LoadingScreen />;
  if (!listing) return <ErrorPage type="404" />;

  const handleSave = () => {
    mutation.mutate(localSelectedIds);
  };

  // 2. Intercept the Back Action
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedModal(true); // Stop! Show modal.
    } else {
      push({ page: "overview" }); // Clean? Go back.
    }
  };

  const handleDiscard = () => {
    setShowUnsavedModal(false);
    push({ page: "overview" }); // Force leave
  };

  return (
    <FullScreenView
      title={`Amenities - ${listing?.title}`}
      onBack={handleBack}
      action={
        <Button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="bg-lapis hover:bg-lapis-hover text-white text-sm"
        >
          {mutation.isPending ? "Saving..." : <>Save Changes</>}
        </Button>
      }
    >
      <div className="px-0 pt-2 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-bold">Select Amenities</h2>
          <p className="text-sm text-gray-500">
            Select all the features available at this property.
          </p>
        </div>

        <AmenitiesSelectorGrid
          selectedIds={localSelectedIds}
          onChange={(ids) => setLocalSelectedIds(ids)}
        />
      </div>
      {/* 3. The Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onDiscard={handleDiscard}
        onSave={() => {
          // Trigger save, but stay open (or let onSuccess handle close)
          handleSave();
          // Note: We handle the actual navigation in mutation.onSuccess
        }}
        isSaving={mutation.isPending}
      />
    </FullScreenView>
  );
}

export default AmenitiesManagement;
