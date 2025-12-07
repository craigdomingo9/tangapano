import { fetchLandlords, verifyLandlordFn } from "@/lib/api/admin/users";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useUsersAdmin(accessToken: string) {
  const queryClient = useQueryClient();

  const {
    data: landlords,
    isLoading: landlordsIsLoading,
    isError: landlordsIsError,
  } = useQuery({
    queryKey: ["landlords"],
    queryFn: () => fetchLandlords(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const { isPending: isVerifyingLandlord, mutate: verifyLandlord } =
    useMutation({
      mutationFn: (id: string) => verifyLandlordFn(accessToken, id),
      onSuccess(data, variables, onMutateResult, context) {
        queryClient.invalidateQueries({ queryKey: ["landlords"] });
        successToast("Landlord was verified successfully.");
      },
      onError(error, variables, onMutateResult, context) {
        errorToast("Landlord verification failed. Please try again");
        console.log(error);
      },
    });

  return {
    landlords,
    landlordsIsLoading,
    landlordsIsError,
    verifyLandlord,
    isVerifyingLandlord,
  };
}

export default useUsersAdmin;
