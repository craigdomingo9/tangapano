import { axiosInstance } from "../config";

export async function fetchDepartmentsAdmin(accessToken: string): Promise<Department[]> {
    const { data } = await axiosInstance.get<Department[]>("/users/departments/", {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function createDepartmentFn(accessToken: string, payload: Partial<Department>): Promise<Department> {
    const { data } = await axiosInstance.post<Department>("/users/departments/", payload, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function fetchDepartmentDetailFn(accessToken: string, id: number): Promise<Department> {
    const { data } = await axiosInstance.get<Department>(`/users/departments/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function updateDepartmentFn(
    accessToken: string,
    payload: Partial<Department>,
    id: number
): Promise<Department> {
    const { data } = await axiosInstance.patch<Department>(
        `/users/departments/${id}/`,
        payload,
        {
            headers: {
                Authorization: `Token ${accessToken}`,
            },
        }
    );
    return data;
}

export async function deleteDepartmentFn(accessToken: string, id: number): Promise<void> {
    await axiosInstance.delete(`/users/departments/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
}
