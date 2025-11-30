import { axiosInstance } from "../config";

export async function deleteListing(listingId: string, accessToken: string) {
  return axiosInstance.delete(`/listings/landlord-listings/${listingId}/`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
}
