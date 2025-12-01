import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersApi as api } from "@/lib/api/users";

function useUserActions(accessToken: string) {
  const queryClient = useQueryClient();
  const queryKey = ["user"];

  const updateUser = useMutation({
    mutationFn: (data: Partial<User>) => api.updateUser(data, accessToken),
    onSuccess: () => {
      successToast("User updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: () => {
      errorToast("Failed to update user");
    },
  });

  const getMe = useQuery({
    queryKey: queryKey,
    queryFn: () => api.getMe(accessToken),
    enabled: !!accessToken,
  });

  return {
    updateUser,
    getMe,
  };
}

export default useUserActions;
