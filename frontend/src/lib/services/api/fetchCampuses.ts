import { axiosInstance } from './config';

/**
 * Fetches the list of campuses from the API.
 * @returns {Promise<Array>} A promise that resolves to the list of campuses.
 */
export default function fetchCampuses() {
  return axiosInstance.get('/campuses/campuses')
    .then(response => response.data);
}
