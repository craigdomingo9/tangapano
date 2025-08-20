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
import GenderSelector from "./GenderSelector";
import AmenitiesSelector from "./AmenitiesSelector";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import buildDynamicSearchParams from "@/lib/services/buildDynamicSearchParams";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentsPerRoomField from "./StudentsPerRoomField";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

function SearchForm() {
  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => fetchAmenities({ params: { has_listings: true } }),
  });
  // TODO: Fetch campuses with listings
  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => fetchCampuses({ params: { has_listings: false } }),
  });

  const router = useRouter();
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      max_occupants: "2",
      campus: "",
      neighborhood: " ",
      gender: "any",
      amenities: [],
    },
  });

  function onSubmit(data: z.infer<typeof searchFormSchema>) {
    setIsLoading(true);
    const params = buildDynamicSearchParams(data);

    // Append amenities as a comma-separated string
    if (data?.amenities && data.amenities.length > 0) {
      const amenitiesParams = data.amenities.join(",");
      params.append("amenities", amenitiesParams);
    }

    router.push(`/listings?${params.toString()}`);

    console.log(data);
  }

  const [IsLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-col gap-6">
              <CampusSelector form={form} campuses={campuses} onSearchPage />
              <NeighborhoodSelector
                form={form}
                campuses={campuses}
                source="searchPage"
              />
              <PriceRangeSelector form={form} />

              <div className="flex justify-between my-3 mb-0">
                <StudentsPerRoomField form={form} fieldName="max_occupants" />
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
              {IsLoading ? <MoonLoader color="white" size={15} /> : "Search"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SearchForm;
