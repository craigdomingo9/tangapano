import { axiosInstance } from "../config";

export async function fetchEmployeesAdmin(accessToken: string) {
    const { data } = await axiosInstance.get("/users/employees/", {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function createEmployeeFn(accessToken: string, payload: any) {
    const { data } = await axiosInstance.post("/users/employees/", payload, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function fetchEmployeeDetailFn(accessToken: string, id: number) {
    const { data } = await axiosInstance.get(`/users/employees/${id}/`, {
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
) {
    const { data } = await axiosInstance.patch(
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

export async function deleteEmployeeFn(accessToken: string, id: number) {
    const { data } = await axiosInstance.delete(`/users/employees/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}
