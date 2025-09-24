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
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

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
    if (!amenities || amenities.length === 0) return;

    const randomSelection = (array: Amenity[], count: number) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const randomAmenities = randomSelection(amenities, 5).map((a) => a.name);
    // Sort the initial selection as well
    const sortedAmenities = randomAmenities.sort((a, b) => a.localeCompare(b));
    setSelectedAmenities(sortedAmenities);
  }, [amenities, amenitiesQueryStatus]);

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
