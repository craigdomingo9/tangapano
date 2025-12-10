import { createCampus, updateCampus } from "@/lib/api/admin/campuses";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCampusesAdmin(accessToken: string) {
  const queryClient = useQueryClient();

  const { mutate: addCampus, isPending: isAddingCampus } = useMutation({
    mutationFn: (data: Campus) => createCampus(accessToken, data),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
      successToast("Campus was created successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });

  const { mutate: editCampus, isPending: isEditingCampus } = useMutation({
    mutationFn: ({ data, id }: { data: Amenity; id: string }) =>
      updateCampus(accessToken, data, id),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
      successToast("Campus was updated successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });

  return {
    addCampus,
    isAddingCampus,
    editCampus,
    isEditingCampus,
  };
}

export default useCampusesAdmin;
