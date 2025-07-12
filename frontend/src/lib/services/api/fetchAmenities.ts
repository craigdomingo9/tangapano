import { axiosInstance } from "./config";

/**
 * Fetches the list of amenities from the API.
 * @returns {Promise<Array>} A promise that resolves to the list of amenities.
 */
export default function fetchAmenities() {
  return axiosInstance.get('/listings/amenities')
    .then(response => response.data);
}
