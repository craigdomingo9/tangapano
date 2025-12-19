import {
    createRoleFn,
    deleteRoleFn,
    fetchRolesAdmin,
    updateRoleFn,
} from "@/lib/api/admin/roles";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useRoles(accessToken: string) {
    const queryClient = useQueryClient();
    const {
        data: roles,
        isLoading: rolesIsLoading,
        isError: rolesIsError,
    } = useQuery({
        queryKey: ["roles"],
        queryFn: () => fetchRolesAdmin(accessToken),
        staleTime: 1000 * 60 * 15,
    });

    const { isPending: isCreatingRole, mutate: createRole } = useMutation({
        mutationFn: (data: any) => createRoleFn(accessToken, data),
        onSuccess(data, variables, onMutateResult, context) {
            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });
            successToast("Role was created successfully.");
        },
        onError(error, variables, onMutateResult, context) {
            errorToast("An unexpected error occured. Please try again.");
            console.log(error);
        },
    });

    const { isPending: isUpdatingRole, mutate: updateRole } = useMutation({
        mutationFn: ({ payload, id }: { payload: any; id: number }) =>
            updateRoleFn(accessToken, payload, id),
        onSuccess(data, variables, onMutateResult, context) {
            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });
            successToast("Role was updated successfully.");
        },
        onError(error, variables, onMutateResult, context) {
            errorToast("An unexpected error occured. Please try again.");
            console.log(error);
        },
    });

    const { isPending: isDeletingRole, mutate: deleteRole } = useMutation({
        mutationFn: (id: number) => deleteRoleFn(accessToken, id),
        onSuccess(data, variables, onMutateResult, context) {
            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });
            successToast("Role was deleted successfully.");
        },
        onError(error, variables, onMutateResult, context) {
            errorToast("An unexpected error occured. Please try again.");
            console.log(error);
        },
    });

    return {
        roles,
        rolesIsLoading,
        rolesIsError,
        isCreatingRole,
        createRole,
        isUpdatingRole,
        updateRole,
        isDeletingRole,
        deleteRole,
    };
}

export default useRoles;
