import {
    createEmployeeFn,
    deleteEmployeeFn,
    fetchEmployeesAdmin,
    updateEmployeeFn,
} from "@/lib/api/admin/employees";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useEmployees(accessToken: string) {
    const queryClient = useQueryClient();
    const {
        data: employees,
        isLoading: employeesIsLoading,
        isError: employeesIsError,
    } = useQuery({
        queryKey: ["employees"],
        queryFn: () => fetchEmployeesAdmin(accessToken),
        staleTime: 1000 * 60 * 15,
    });

    const { isPending: isCreatingEmployee, mutate: createEmployee } = useMutation({
        mutationFn: (data: any) => createEmployeeFn(accessToken, data),
        onSuccess(data, variables, onMutateResult, context) {
            queryClient.invalidateQueries({
                queryKey: ["employees"],
            });
            successToast("Employee was created successfully.");
        },
        onError(error, variables, onMutateResult, context) {
            errorToast("An unexpected error occured. Please try again.");
            console.log(error);
        },
    });

    const { isPending: isUpdatingEmployee, mutate: updateEmployee } = useMutation({
        mutationFn: ({ payload, id }: { payload: any; id: number }) =>
            updateEmployeeFn(accessToken, payload, id),
        onSuccess(data, variables, onMutateResult, context) {
            queryClient.invalidateQueries({
                queryKey: ["employees"],
            });
            successToast("Employee was updated successfully.");
        },
        onError(error, variables, onMutateResult, context) {
            errorToast("An unexpected error occured. Please try again.");
            console.log(error);
        },
    });

    const { isPending: isDeletingEmployee, mutate: deleteEmployee } = useMutation({
        mutationFn: (id: number) => deleteEmployeeFn(accessToken, id),
        onSuccess(data, variables, onMutateResult, context) {
            queryClient.invalidateQueries({
                queryKey: ["employees"],
            });
            successToast("Employee was deleted successfully.");
        },
        onError(error, variables, onMutateResult, context) {
            errorToast("An unexpected error occured. Please try again.");
            console.log(error);
        },
    });

    return {
        employees,
        employeesIsLoading,
        employeesIsError,
        isCreatingEmployee,
        createEmployee,
        isUpdatingEmployee,
        updateEmployee,
        isDeletingEmployee,
        deleteEmployee,
    };
}

export default useEmployees;
