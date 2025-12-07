import { axiosInstance } from "../config";

export async function fetchLandlordListingsAdmin(
  accessToken: string,
  id: string | number
) {
  const { data } = await axiosInstance.get(`/control/listings?landlord=${id}`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return data;
}
