import { axiosInstance } from "../config";

export async function fetchLandlords(accessToken: string) {
  const { data } = await axiosInstance.get<Landlord[]>(
    "/control/users/landlords/",
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return data;
}

export async function verifyLandlordFn(accessToken: string, id: string) {
  const { data } = await axiosInstance.post(
    `/control/users/landlords/${id}/verify/`,
    {
      is_verified: true,
    },
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return data;
}
