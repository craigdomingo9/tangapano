"use client";
import { createSearchForm, searchFormSchema } from "@/lib/services/forms/searchForm"
import { useQuery } from '@tanstack/react-query'
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


function SearchForm() {

  const { data: amenities } = useQuery({ 
    queryKey: ['amenities'], 
    queryFn: fetchAmenities
  })
  const { data: campuses } = useQuery({ 
    queryKey: ['campuses'], 
    queryFn: fetchCampuses 
  })

  // console.log("Campuses:", campuses);
  // console.log("Amenities:", amenities);

  const router = useRouter();
  const form = createSearchForm();

  function onSubmit(data: z.infer<typeof searchFormSchema>) {
    const params = buildDynamicSearchParams(data);

    // Append amenities as a comma-separated string
    if (data?.amenities && data.amenities.length > 0) {
      const amenitiesParams = data.amenities.join(',');
      params.append("amenities", amenitiesParams)
    }

    router.push(`/listings?${params.toString()}`);

    console.log(data)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CampusSelector
            form={form}
            campuses={campuses}
          />
          <NeighborhoodSelector
            form={form}
            campuses={campuses}
          />
          <PriceRangeSelector 
            form={form}
          />
          <div>
            <div className="flex justify-between my-3">
              <InputField
                form={form}
                fieldName="max_occupants"
                label="Students Per Room"
                defaultValue={2}
                type="number"
                inputClassName="w-34 min-h-12 rounded-sm bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                labelClassName="text-white"
              />
              <GenderSelector 
                form={form}
              />

            </div>
          </div>

          <AmenitiesSelector 
            amenities={amenities}
            form={form}
          />

          <div className="grid mb-6">
            <Button type="submit" className="mx-auto w-full h-16 text-lg bg-amber-600 cursor-pointer">Search</Button>
          </div>

        </form>
      </Form>
    </div>
  )
}

export default SearchForm
