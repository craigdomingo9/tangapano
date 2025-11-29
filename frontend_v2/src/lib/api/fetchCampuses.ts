import { axiosInstance } from "./config";

/**
 * Fetches the list of campuses from the API.
 * @returns {Promise<Array>} A promise that resolves to the list of campuses.
 */
export default function fetchCampuses({
  params = {},
}: {
  params?: Record<string, any>;
}) {
  const searchParams = new URLSearchParams(params);

  return axiosInstance
    .get("/campuses/campuses/" + "?" + searchParams.toString())
    .then((response) => response.data);
}
