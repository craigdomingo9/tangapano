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
      if (prev.includes(amenity.name)) {
        return prev.filter((name) => name !== amenity.name);
      }
      return [...prev, amenity.name];
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
    // console.log("Randomly selected amenities:", randomAmenities);
    setSelectedAmenities(randomAmenities);
  }, [amenities, amenitiesQueryStatus]);

  useEffect(() => {
    form.setValue("amenities", selectedAmenities);
  }, [selectedAmenities, form]);

  return (
    <div className="flex flex-col max-w-xs my-5 gap-y-4">
      <Label>Select Perks</Label>
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
        <div className="flex flex-wrap px-2 gap-2 justify-self-center">
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
      )}
      <hr />
    </div>
  );
}

export default AmenitiesBadgeSelector;
