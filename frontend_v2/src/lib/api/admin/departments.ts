import { axiosInstance } from "../config";

export async function fetchDepartmentsAdmin(accessToken: string) {
    const { data } = await axiosInstance.get("/users/departments/", {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function createDepartmentFn(accessToken: string, payload: any) {
    const { data } = await axiosInstance.post("/users/departments/", payload, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function fetchDepartmentDetailFn(accessToken: string, id: number) {
    const { data } = await axiosInstance.get(`/users/departments/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function updateDepartmentFn(
    accessToken: string,
    payload: any,
    id: number
) {
    const { data } = await axiosInstance.patch(
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

export async function deleteDepartmentFn(accessToken: string, id: number) {
    const { data } = await axiosInstance.delete(`/users/departments/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}
