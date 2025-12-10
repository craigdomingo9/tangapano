import {
  createAmenity,
  fetchAmenitiesAdmin,
  updateAmenity,
} from "@/lib/api/admin/amenities";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useAmenitiesAdmin(accessToken: string) {
  const queryClient = useQueryClient();

  const {
    data: amenities,
    isLoading: amenitiesIsLoading,
    isError: amenitiesIsError,
  } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => fetchAmenitiesAdmin(),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: addAmenity, isPending: isAddingAmenity } = useMutation({
    mutationFn: (data: Amenity) => createAmenity(accessToken, data),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["amenity-categories"],
      });
      successToast("Amenity was created successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });

  const { mutate: editAmenity, isPending: isEditingAmenity } = useMutation({
    mutationFn: ({ data, id }: { data: Amenity; id: string }) =>
      updateAmenity(accessToken, data, id),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["amenity-categories"],
      });
      successToast("Amenity was updated successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });

  return {
    amenities,
    amenitiesIsLoading,
    amenitiesIsError,
    addAmenity,
    isAddingAmenity,
    editAmenity,
    isEditingAmenity,
  };
}

export default useAmenitiesAdmin;
