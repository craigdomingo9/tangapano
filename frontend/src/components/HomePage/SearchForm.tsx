"use client";
import { searchFormSchema } from "@/lib/services/forms/searchForm";
import { useQuery } from "@tanstack/react-query";
import fetchCampuses from "@/lib/services/api/fetchCampuses";
import fetchAmenities from "@/lib/services/api/fetchAmenities";
import { Form } from "../ui/form";
import { z } from "zod";
import CampusSelector from "./CampusSelector";
import NeighborhoodSelector from "./NeighborhoodSelector";
import PriceRangeSelector from "./PriceRangeSelector";
import InputField from "../universal/Form/Elements/InputField";
import GenderSelector from "./GenderSelector";
import AmenitiesSelector from "./AmenitiesSelector";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import buildDynamicSearchParams from "@/lib/services/buildDynamicSearchParams";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function SearchForm() {
  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => fetchAmenities({ params: { has_listings: true } }),
  });
  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => fetchCampuses({ params: { has_listings: true } }),
  });

  // console.log("Campuses:", campuses);
  // console.log("Amenities:", amenities);

  const router = useRouter();
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
  });

  function onSubmit(data: z.infer<typeof searchFormSchema>) {
    const params = buildDynamicSearchParams(data);

    // Append amenities as a comma-separated string
    if (data?.amenities && data.amenities.length > 0) {
      const amenitiesParams = data.amenities.join(",");
      params.append("amenities", amenitiesParams);
    }

    router.push(`/listings?${params.toString()}`);

    console.log(data);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-col gap-6">
              <CampusSelector form={form} campuses={campuses} />
              <NeighborhoodSelector
                form={form}
                campuses={campuses}
                source="searchPage"
              />
              <PriceRangeSelector form={form} />

              <div className="flex justify-between my-3 mb-0">
                <InputField
                  form={form}
                  fieldName="max_occupants"
                  label="Students Per Room"
                  defaultValue={2}
                  type="number"
                  inputClassName="w-34 min-h-12 rounded-sm bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  labelClassName="text-white"
                />
                <GenderSelector form={form} />
              </div>
            </div>

            <AmenitiesSelector amenities={amenities} form={form} />
          </div>

          <div className="grid mb-6">
            <Button
              type="submit"
              className="mx-auto w-full h-16 text-lg cursor-pointer"
            >
              Search
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SearchForm;
