import { createCity, fetchCities } from "@/lib/api/admin/cities";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useLocationsAdmin(accessToken: string) {
  const queryClient = useQueryClient();

  const {
    data: locations,
    isLoading: locationsIsLoading,
    isError: locationsIsError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: () => fetchCities(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: addCity, isPending: isAddingCity } = useMutation({
    mutationFn: (data: Partial<City>) => createCity(accessToken, data),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
      successToast("City was created successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });

  return {
    locations,
    locationsIsLoading,
    locationsIsError,
    addCity,
    isAddingCity,
  };
}

export default useLocationsAdmin;
