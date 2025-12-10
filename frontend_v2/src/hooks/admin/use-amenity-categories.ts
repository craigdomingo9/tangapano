import {
  createAmenityCategory,
  fetchAmenityCategoriesAdmin,
} from "@/lib/api/admin/amenity-categories";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useAmenityCategoriesAdmin(accessToken: string) {
  const queryClient = useQueryClient();

  const {
    data: amenityCategories,
    isLoading: amenityCategoriesIsLoading,
    isError: amenityCategoriesIsError,
  } = useQuery({
    queryKey: ["amenity-categories"],
    queryFn: () => fetchAmenityCategoriesAdmin(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: addAmenityCategory, isPending: isAddingAmenityCategory } =
    useMutation({
      mutationFn: (data: AmenityCategory) =>
        createAmenityCategory(accessToken, data),
      onSuccess(data, variables, onMutateResult, context) {
        queryClient.invalidateQueries({
          queryKey: ["amenity-categories"],
        });
        successToast("Category was created successfully.");
      },
      onError(error, variables, onMutateResult, context) {
        errorToast("An unexpected error occured. Please try again.");
        console.log(error);
      },
    });

  return {
    amenityCategories,
    amenityCategoriesIsLoading,
    amenityCategoriesIsError,
    addAmenityCategory,
    isAddingAmenityCategory,
  };
}

export default useAmenityCategoriesAdmin;
