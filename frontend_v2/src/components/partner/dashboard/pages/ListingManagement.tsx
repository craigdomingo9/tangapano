"use client";

import { useListingDetail } from "@/hooks/use-reference-data";
import { useRouterPush } from "@/hooks/use-router-push";
import { ErrorPage } from "../overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { FullScreenView } from "@/components/ui/FullScreenView";
import createEntityStore from "@/lib/stores/entityStore";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ListingPayload } from "@/lib/api/listings";
import { errorToast, successToast } from "@/lib/toast";
import PropertyDetailsManager from "../listings/PropertyDetailsManager";
import { PartnerComponentProps } from "@/lib/types/partner";

// Form State uses IDs, not Objects
export interface FormState {
  title: string;
  campus: string; // Storing the ID
  neighborhood: string; // Storing the ID
  distance_from_campus: number;
  apply_agent_fee: boolean;
}

const INITIAL_STATE: FormState = {
  title: "",
  campus: "",
  neighborhood: "",
  distance_from_campus: 0,
  apply_agent_fee: false,
};

// Store for local form state
export const usePropertyDetails = createEntityStore<FormState>(INITIAL_STATE);

function ListingManagement({ params, serverData }: PartnerComponentProps) {
  const { push } = useRouterPush();
  const { listingId, mode } = params;
  const { accessToken } = serverData;
  const queryClient = useQueryClient();

  // Determine Mode
  const isEditMode = mode === "edit" && !!listingId;
  const pageTitle = isEditMode ? "Edit Property Details" : "Add New Property";

  // Fetch Listing (only if editing)
  const { data: listing, isLoading } = useListingDetail(listingId!, isEditMode);

  // Local Form Store
  const {
    entities: formData,
    setEntities: setFormData,
    reset: resetForm,
  } = usePropertyDetails();

  // 1. Sync Existing Data to Form State on Load
  useEffect(() => {
    if (isEditMode && listing) {
      const parsedDist = parseInt(listing.distance_from_campus) || 0;

      setFormData({
        title: listing.title,
        campus: listing.campus.id, // Extract ID from object
        neighborhood: listing.neighborhood.id, // Extract ID from object
        distance_from_campus: parsedDist,
        apply_agent_fee: listing.apply_agent_fee,
      });
    } else if (!isEditMode) {
      // Reset to initial if creating new
      setFormData(INITIAL_STATE);
    }
  }, [listing, isEditMode, setFormData]);

  // 2. Mutation Logic
  const mutation = useMutation({
    mutationFn: (data: ListingPayload) => {
      if (isEditMode) {
        return api.update(listingId!, data, accessToken);
      } else {
        return api.create(data, accessToken);
      }
    },
    onSuccess: () => {
      const msg = isEditMode
        ? "Property was updated successfully"
        : "Property was created successfully";
      successToast(msg);
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      }
      resetForm();
      push({ page: "overview" });
    },
    onError: () => {
      errorToast("Something went wrong. Please check your inputs.");
    },
  });

  // 3. Submit Handler
  const handleSubmit = () => {
    // Basic Validation
    if (!formData.title || !formData.campus || !formData.neighborhood) {
      errorToast("Please fill in all required fields");
      return;
    }

    // Transform FormState to API Payload
    const payload: ListingPayload = {
      title: formData.title,
      campus: formData.campus, // Backend expects snake_case ID
      neighborhood: formData.neighborhood,
      distance_from_campus: formData.distance_from_campus,
      apply_agent_fee: formData.apply_agent_fee,
    };

    mutation.mutate(payload);
  };

  // 4. Field Change Handler (passed to child)
  function handleFieldChange(field: keyof FormState, value: any) {
    setFormData({ ...formData, [field]: value });
  }

  // Guards
  if (!accessToken) return <ErrorPage type="access" />;
  if (isLoading && isEditMode) return <LoadingScreen />;
  if (!listing && isEditMode) return <ErrorPage type="404" />;
  if (!listing && !isEditMode && mode !== "create") return <LoadingScreen />;

  return (
    <FullScreenView title={pageTitle} onBack={() => push({ page: "overview" })}>
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-200">
          <PropertyDetailsManager
            title={
              isEditMode ? `Edit ${listing?.title}` : "New Property Listing"
            }
            subtitle={
              isEditMode
                ? "Update listing information"
                : "Fill in the details for your new property"
            }
            onCancel={() => push({ page: "overview" })}
            onChange={handleFieldChange}
            onSave={handleSubmit}
            // Pass the form state, not the listing object!
            formState={formData}
            isSaving={mutation.isPending}
          />
        </div>
      </div>
    </FullScreenView>
  );
}

export default ListingManagement;
