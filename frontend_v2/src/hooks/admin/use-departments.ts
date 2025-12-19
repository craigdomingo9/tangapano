import {
    createDepartmentFn,
    deleteDepartmentFn,
    fetchDepartmentsAdmin,
    updateDepartmentFn,
} from "@/lib/api/admin/departments";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useDepartments(accessToken: string) {
    const queryClient = useQueryClient();
    const {
        data: departments,
        isLoading: departmentsIsLoading,
        isError: departmentsIsError,
    } = useQuery({
        queryKey: ["departments"],
        queryFn: () => fetchDepartmentsAdmin(accessToken),
        staleTime: 1000 * 60 * 15,
    });

    const { isPending: isCreatingDepartment, mutate: createDepartment } =
        useMutation({
            mutationFn: (data: any) => createDepartmentFn(accessToken, data),
            onSuccess(data, variables, onMutateResult, context) {
                queryClient.invalidateQueries({
                    queryKey: ["departments"],
                });
                successToast("Department was created successfully.");
            },
            onError(error, variables, onMutateResult, context) {
                errorToast("An unexpected error occured. Please try again.");
                console.log(error);
            },
        });

    const { isPending: isUpdatingDepartment, mutate: updateDepartment } =
        useMutation({
            mutationFn: ({ payload, id }: { payload: any; id: number }) =>
                updateDepartmentFn(accessToken, payload, id),
            onSuccess(data, variables, onMutateResult, context) {
                queryClient.invalidateQueries({
                    queryKey: ["departments"],
                });
                successToast("Department was updated successfully.");
            },
            onError(error, variables, onMutateResult, context) {
                errorToast("An unexpected error occured. Please try again.");
                console.log(error);
            },
        });

    const { isPending: isDeletingDepartment, mutate: deleteDepartment } =
        useMutation({
            mutationFn: (id: number) => deleteDepartmentFn(accessToken, id),
            onSuccess(data, variables, onMutateResult, context) {
                queryClient.invalidateQueries({
                    queryKey: ["departments"],
                });
                successToast("Department was deleted successfully.");
            },
            onError(error, variables, onMutateResult, context) {
                errorToast("An unexpected error occured. Please try again.");
                console.log(error);
            },
        });

    return {
        departments,
        departmentsIsLoading,
        departmentsIsError,
        isCreatingDepartment,
        createDepartment,
        isUpdatingDepartment,
        updateDepartment,
        isDeletingDepartment,
        deleteDepartment,
    };
}

export default useDepartments;
