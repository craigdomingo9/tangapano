import React, { useEffect, useState } from "react";
import {
  useAmenitiesDialogState,
  useSelectedAmenities,
} from "./AmenitiesDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchAmenities from "@/lib/services/api/fetchAmenities";
import axios from "axios";
import { useSelectedListing } from "../../CardButtons";
import { MoonLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function AmenitiesDialogContent() {
  const { entities: selectedAmenities } = useSelectedAmenities();
  const [currentSelectedAmenities, setCurrentSelectedAmenities] =
    useState<Amenity[]>();
  const { entities: selectedListing } = useSelectedListing();
  const { setEntities: setDialog } = useAmenitiesDialogState();
  const [isSaving, setIsSaving] = useState(false);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const { data: allAvailableAmenities, status } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => fetchAmenities({ params: {} }),
  });

  useEffect(() => {
    setCurrentSelectedAmenities(selectedAmenities);
  }, [selectedAmenities]);

  async function handleSave() {
    setIsSaving(true);
    const payload = {
      amenities: currentSelectedAmenities?.map((a) => a.id),
    };

    const response = await axios.patch(
      `/api/landlord-listings/${selectedListing?.id}/amenities`,
      payload,
    );

    if (response.status >= 400) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    toast.success("Amenities were updated successfully.");

    setIsSaving(false);
    setDialog(false);
  }

  const handleToggleAmenity = (amenityId: string) => {
    setCurrentSelectedAmenities((prev) => {
      const isSelected = prev?.some((item) => item.id === amenityId);
      return isSelected
        ? prev?.filter((item) => item.id !== amenityId)
        : [
            ...(prev as Amenity[]),
            allAvailableAmenities.find(
              (item: Amenity) => item.id === amenityId,
            )!,
          ];
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
      {status === "pending" && (
        <div className="w-full flex justify-center items-center mt-4">
          <MoonLoader size={15} />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6 max-h-60 overflow-y-auto pr-2">
        {allAvailableAmenities?.map((amenity: Amenity) => (
          <button
            key={amenity.display_name}
            type="button"
            onClick={() => handleToggleAmenity(amenity.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200
              ${
                currentSelectedAmenities?.some(
                  (item) => item?.id === amenity?.id,
                )
                  ? "bg-[var(--lapis-lazuli)] text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {amenity.display_name}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() => setDialog(false)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-white font-medium"
        >
          {isSaving ? <MoonLoader color="white" size={15} /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default AmenitiesDialogContent;
