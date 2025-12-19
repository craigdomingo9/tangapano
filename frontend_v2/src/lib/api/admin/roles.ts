import { axiosInstance } from "../config";

export async function fetchRolesAdmin(accessToken: string): Promise<Role[]> {
    const { data } = await axiosInstance.get<Role[]>("/users/roles/", {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function createRoleFn(accessToken: string, payload: Partial<Role>): Promise<Role> {
    const { data } = await axiosInstance.post<Role>("/users/roles/", payload, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function fetchRoleDetailFn(accessToken: string, id: number): Promise<Role> {
    const { data } = await axiosInstance.get<Role>(`/users/roles/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
    return data;
}

export async function updateRoleFn(
    accessToken: string,
    payload: Partial<Role>,
    id: number
): Promise<Role> {
    const { data } = await axiosInstance.patch<Role>(
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

export async function deleteRoleFn(accessToken: string, id: number): Promise<void> {
    await axiosInstance.delete(`/users/roles/${id}/`, {
        headers: {
            Authorization: `Token ${accessToken}`,
        },
    });
}
