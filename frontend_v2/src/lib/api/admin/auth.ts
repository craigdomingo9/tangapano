import { axiosInstance } from "../config";

export async function changeAdminPasswordFn(
  accessToken: string,
  username: string,
  newPassword: string,
) {
  const { data } = await axiosInstance.post(
    `/users/auth/admin/change-password/`,
    {
      username,
      new_password: newPassword,
    },
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    },
  );
  return data;
}
