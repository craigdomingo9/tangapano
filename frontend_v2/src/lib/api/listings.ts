import { AxiosError } from "axios";
import { axiosInstance } from "./config";
import { cache } from "react";

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

// 1. Wrap in 'cache' to dedupe requests between Metadata and Page
export const getListingData = cache(async (slug: string) => {
  const response = await axiosInstance.get(`/listings/listing/${slug}/`);
  return response.data;
});

export const updateAmenities = async (
  listingId: string,
  selectedIds: (number | string)[],
  accessToken: string
) => {
  await axiosInstance.patch(
    `/listings/landlord-listings/${listingId}/`,
    {
      amenity_ids: selectedIds,
    },
    { headers: { Authorization: `Token ${accessToken}` } }
  );
};

export interface ListingPayload {
  title: string;
  campus: string; // Send ID, not object
  neighborhood: string; // Send ID, not object
  distance_from_campus: number;
  apply_agent_fee: boolean;
}

export const api = {
  create: async (data: ListingPayload, token: string) => {
    const response = await axiosInstance.post<Listing>(
      `/listings/landlord-listings/`,
      data,
      { headers: { Authorization: `Token ${token}` } }
    );
    return response.data;
  },

  update: async (id: string, data: Partial<ListingPayload>, token: string) => {
    const response = await axiosInstance.patch<Listing>(
      `/listings/landlord-listings/${id}/`,
      data,
      { headers: { Authorization: `Token ${token}` } }
    );
    return response.data;
  },
};
