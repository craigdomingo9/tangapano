import { fetchLandlordListingsAdmin } from "@/lib/api/admin/listings";
import {
  fetchLandlordDetailsAdmin,
  suspendLandlordFn,
} from "@/lib/api/admin/users";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useListingsAdmin(accessToken: string, landlordId: string) {
  const queryClient = useQueryClient();
  const {
    data: listings,
    isLoading: listingsIsLoading,
    isError: listingsIsError,
  } = useQuery({
    queryKey: ["listings-admin"],
    queryFn: () => fetchLandlordListingsAdmin(accessToken, landlordId),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: landlord,
    isLoading: landlordIsLoading,
    isError: landlordIsError,
  } = useQuery({
    queryKey: ["landlord", landlordId],
    queryFn: () => fetchLandlordDetailsAdmin(accessToken, landlordId),
    staleTime: 1000 * 60 * 5,
  });

  const { isPending: isSuspendingLandlord, mutate: suspendLandlord } =
    useMutation({
      mutationFn: () => suspendLandlordFn(accessToken, landlordId),
      onSuccess(data, variables, onMutateResult, context) {
        queryClient.invalidateQueries({ queryKey: ["landlord", landlordId] });
        successToast("Landlord was suspended successfully.");
      },
      onError(error, variables, onMutateResult, context) {
        errorToast("Landlord suspension failed. Please try again");
        console.log(error);
      },
    });

  return {
    listings,
    listingsIsLoading,
    listingsIsError,
    landlord,
    landlordIsLoading,
    landlordIsError,
    isSuspendingLandlord,
    suspendLandlord,
  };
}

export default useListingsAdmin;
