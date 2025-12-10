import { axiosInstance } from "../config";

export async function fetchNotifications(accessToken: string) {
  const { data } = await axiosInstance.get<Notification[]>(
    "/notifications/notifications/",
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );
  return data;
}
