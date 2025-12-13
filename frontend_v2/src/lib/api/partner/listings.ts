import { axiosInstance } from "../config";

export async function fetchListingDetailPartner(
  accessToken: string,
  id: string
) {
  const { data } = await axiosInstance.get<Listing>(
    `/listings/landlord-listings/${id}/`,
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return data;
}
