import {
  fetchInventoryAdmin,
  lockListingFn,
  unLockListingFn,
} from "@/lib/api/admin/inventory";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useInventory(accessToken: string) {
  const queryClient = useQueryClient();
  const {
    data: inventory,
    isLoading: inventoryIsLoading,
    isError: inventoryIsError,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetchInventoryAdmin(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const { isPending: isLockingListing, mutate: lockListing } = useMutation({
    mutationFn: (id: string) => lockListingFn(accessToken, id),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
      successToast("Listing was locked successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });
  const { isPending: isUnlockingListing, mutate: unlockListing } = useMutation({
    mutationFn: (id: string) => unLockListingFn(accessToken, id),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
      successToast("Listing was unlocked successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });
  return {
    inventory,
    inventoryIsLoading,
    inventoryIsError,
    isLockingListing,
    lockListing,
    isUnlockingListing,
    unlockListing,
  };
}

export default useInventory;
