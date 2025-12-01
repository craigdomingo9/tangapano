import { axiosInstance } from "./config";

function login(data: { username: string; password: string }) {
  return axiosInstance.post("/users/login/", data);
}

export const UsersApi = {
  updateUser: async (data: Partial<User>, accessToken: string) => {
    const response = await axiosInstance.patch<User>(`/users/me/`, data, {
      headers: { Authorization: `Token ${accessToken}` },
    });
    return response.data;
  },

  getMe: async (accessToken: string) => {
    const response = await axiosInstance.get<User>("/users/me/", {
      headers: { Authorization: `Token ${accessToken}` },
    });
    return response.data;
  },
};
