import { axiosInstance } from "../config";

export default async function fetchLandlordListings(accessToken: string) {
  const { data } = await axiosInstance.get("/listings/landlord-listings/", {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return data;
}
