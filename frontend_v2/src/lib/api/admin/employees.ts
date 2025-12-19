import { axiosInstance } from "../config";

export async function fetchEmployeesAdmin(accessToken: string): Promise<Employee[]> {
    const { data } = await axiosInstance.get<Employee[]>("/users/employees/", {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function createEmployeeFn(accessToken: string, payload: any): Promise<Employee> {
    const { data } = await axiosInstance.post<Employee>("/users/employees/", payload, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function fetchEmployeeDetailFn(accessToken: string, id: number): Promise<Employee> {
    const { data } = await axiosInstance.get<Employee>(`/users/employees/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function updateEmployeeFn(
    accessToken: string,
    payload: any,
    id: number
): Promise<Employee> {
    const { data } = await axiosInstance.patch<Employee>(
        `/users/employees/${id}/`,
        payload,
        {
            headers: {
                Authorization: `Token ${accessToken}`,
            },
        }
    );
    return data;
}

export async function deleteEmployeeFn(accessToken: string, id: number): Promise<void> {
    await axiosInstance.delete(`/users/employees/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
}
