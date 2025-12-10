import {
  createNeighborhood,
  fetchNeighborhoods,
} from "@/lib/api/admin/neighborhoods";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useNeighborhoodAdmin(accessToken: string) {
  const queryClient = useQueryClient();

  const {
    data: neighborhoods,
    isLoading: neighborhoodsIsLoading,
    isError: neighborhoodsIsError,
  } = useQuery({
    queryKey: ["neighborhoods"],
    queryFn: () => fetchNeighborhoods(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: addNeighborhood, isPending: isAddingNeighborhood } =
    useMutation({
      mutationFn: (data: Neighborhood) => createNeighborhood(accessToken, data),
      onSuccess(data, variables, onMutateResult, context) {
        queryClient.invalidateQueries({
          queryKey: ["locations"],
        });
        successToast("Neighborhood was created successfully.");
      },
      onError(error, variables, onMutateResult, context) {
        errorToast("An unexpected error occured. Please try again.");
        console.log(error);
      },
    });

  return {
    addNeighborhood,
    isAddingNeighborhood,
    neighborhoods,
  };
}

export default useNeighborhoodAdmin;
