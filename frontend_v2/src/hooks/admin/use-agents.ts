import {
  createAgentFn,
  fetchAgentsAdmin,
  updateAgentFn,
} from "@/lib/api/admin/agents";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useAgents(accessToken: string) {
  const queryClient = useQueryClient();
  const {
    data: agents,
    isLoading: agentsIsLoading,
    isError: agentsIsError,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: () => fetchAgentsAdmin(accessToken),
    staleTime: 1000 * 60 * 15,
  });

  const { isPending: isCreatingAgent, mutate: createAgent } = useMutation({
    mutationFn: (data: any) => createAgentFn(accessToken, data),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      successToast("Agent was created successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });

  const { isPending: isUpdatingAgent, mutate: updateAgent } = useMutation({
    mutationFn: ({ formData, id }: { formData: any; id: any }) =>
      updateAgentFn(accessToken, formData, id),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      successToast("Agent was updated successfully.");
    },
    onError(error, variables, onMutateResult, context) {
      errorToast("An unexpected error occured. Please try again.");
      console.log(error);
    },
  });
  return {
    agents,
    agentsIsLoading,
    agentsIsError,
    isCreatingAgent,
    createAgent,
    isUpdatingAgent,
    updateAgent,
  };
}

export default useAgents;
