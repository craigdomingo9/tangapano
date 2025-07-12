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
    const params = new URLSearchParams();

    if (data.campus) params.append("campus", data.campus);
    if (data.neighborhood) params.append("neighborhood", data.neighborhood);
    if (data.price_min) params.append("price_range_min", data.price_min.toString());
    if (data.price_max) params.append("price_range_max", data.price_max.toString());
    if (data.gender) params.append("gender", data.gender);
    if (data.max_occupants) params.append("max_occupants", data.max_occupants.toString());

    // Append amenities as repeated param
    if (data?.amenities && data.amenities.length > 0) {
      data.amenities.forEach((id) => params.append("amenity", id));
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
            campuses={campuses?.map((campus: Campus) => campus?.name) || []}
          />
          <NeighborhoodSelector
            form={form}
            campuses={campuses || []}
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
