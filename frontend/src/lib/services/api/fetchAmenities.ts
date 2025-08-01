import { axiosInstance } from "./config";

/**
 * Fetches the list of amenities from the API.
 * @returns {Promise<Array>} A promise that resolves to the list of amenities.
 */
export default function fetchAmenities({
  params = {},
}: {
  params?: Record<string, any>;
}) {
  const searchParams = new URLSearchParams(params);

  return axiosInstance
    .get("/listings/amenities" + "?" + searchParams.toString())
    .then((response) => response.data);
}
