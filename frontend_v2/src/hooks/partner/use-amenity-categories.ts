import { fetchAmenityCategoriesPartner } from "@/lib/api/partner/amenity-categories";
import { useQuery } from "@tanstack/react-query";

export default function useAmenityCategoriesPartner(accessToken?: string) {
  const {
    data: amenityCategories,
    isLoading: amenityCategoriesIsLoading,
    isError: amenityCategoriesIsError,
  } = useQuery({
    queryKey: ["amenity-categories-partner"],
    queryFn: () => fetchAmenityCategoriesPartner(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    amenityCategories,
    amenityCategoriesIsLoading,
    amenityCategoriesIsError,
  };
}
