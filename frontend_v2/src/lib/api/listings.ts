import { AxiosError } from "axios";
import { axiosInstance } from "./config";

export const fetchListings = async ({
  pageParam = 1,
  queryString,
}: {
  pageParam?: number | unknown;
  queryString: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `/listings/listings/?${queryString}&is_full=false&page=${pageParam}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }
    throw error;
  }
};

export const fetchListingById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/listings/listing/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch listing ${id}`);
  }
};
