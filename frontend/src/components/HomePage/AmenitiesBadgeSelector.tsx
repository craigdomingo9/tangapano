import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { BarLoader } from "react-spinners";

type Props = {
  amenities: Amenity[];
  form: UseFormReturn<any, any, any>;
  amenitiesQueryStatus: "success" | "error" | "pending";
};

function AmenitiesBadgeSelector({
  amenities,
  form,
  amenitiesQueryStatus,
}: Props) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("preferred-amenities")
        : null;
    return saved
      ? JSON.parse(saved)
      : [
          "wifi",
          "study_desk",
          "multiple_bathrooms",
          "shared_kitchen",
          "refrigerator",
          "solar_power",
          "security_gate",
          "starlink_internet",
        ];
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem(
      "preferred-amenities",
      JSON.stringify(selectedAmenities)
    );
  }, [selectedAmenities]);

  function handleBadgeClick(amenity: Amenity) {
    setSelectedAmenities((prev) => {
      let newAmenities;
      if (prev.includes(amenity.name)) {
        newAmenities = prev.filter((name) => name !== amenity.name);
      } else {
        newAmenities = [...prev, amenity.name];
      }
      // Sort the amenities alphabetically in a single operation
      return newAmenities.sort((a, b) => a.localeCompare(b));
    });
  }

  useEffect(() => {
    form.setValue("amenities", selectedAmenities);
  }, [selectedAmenities, form]);

  return (
    <div className="flex flex-col max-w-xs my-5 gap-y-4">
      <Label>Perks</Label>
      <hr />

      {amenitiesQueryStatus !== "success" && (
        <div className="flex justify-center place-items-center">
          <BarLoader
            color="var(--lapis-lazuli)"
            speedMultiplier={1.5}
            width={100}
            className="block"
          />
        </div>
      )}

      {amenitiesQueryStatus === "success" && (
        <div className="relative">
          <div className="flex flex-wrap px-2 gap-2 justify-self-center max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {amenities?.map((amenity) => (
              <div
                className={`px-3 py-1 rounded-full text-sm cursor-pointer hover:scale-[1.03] font-medium transition-all duration-200 ${
                  selectedAmenities.includes(amenity.name)
                    ? "bg-[var(--lapis-lazuli)] text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                key={amenity.id}
                onClick={() => {
                  handleBadgeClick(amenity);
                }}
              >
                {amenity.display_name}
              </div>
            ))}
          </div>
          {/* Gradient transition at the bottom */}
          <div className="absolute -bottom-2 left-0 right-0 h-14 bg-gradient-to-t from-[var(--ou-crimson)] to-transparent pointer-events-none mt-[-24px]"></div>
        </div>
      )}
      <hr />
    </div>
  );
}

export default AmenitiesBadgeSelector;
