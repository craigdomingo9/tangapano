import { axiosInstance } from "../config";

export async function fetchRolesAdmin(accessToken: string) {
    const { data } = await axiosInstance.get("/users/roles/", {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function createRoleFn(accessToken: string, payload: any) {
    const { data } = await axiosInstance.post("/users/roles/", payload, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function fetchRoleDetailFn(accessToken: string, id: number) {
    const { data } = await axiosInstance.get(`/users/roles/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function updateRoleFn(
    accessToken: string,
    payload: any,
    id: number
) {
    const { data } = await axiosInstance.patch(
        `/users/roles/${id}/`,
        payload,
        {
            headers: {
                Authorization: `Token ${accessToken}`,
            },
        }
    );
    return data;
}

export async function deleteRoleFn(accessToken: string, id: number) {
    const { data } = await axiosInstance.delete(`/users/roles/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}
