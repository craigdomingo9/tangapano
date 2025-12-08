import { axiosInstance } from "../config";

export interface Inventory {
  id: number;
  title: string;
  landlord_name: string;
  location: string;
  campus_name: string;
  is_active: boolean;
  is_locked: boolean;
  main_image: string;
  vacancy_stats: {
    total: number;
    filled: number;
    left: number;
    percent: number;
  };
  stats: {
    id: number;
    listing: number;
    total_views: number;
    total_inquiries: number;
    last_updated: string;
  };
}

export async function fetchInventoryAdmin(accessToken: string) {
  const { data } = await axiosInstance.get<Inventory[]>("/control/listings/", {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });

  return data;
}
export async function lockListingFn(accessToken: string, id: string) {
  const { data } = await axiosInstance.post(
    `/control/listings/${id}/lock/`,
    {},
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return data;
}

export async function unLockListingFn(accessToken: string, id: string) {
  const { data } = await axiosInstance.post(
    `/control/listings/${id}/unlock/`,
    {},
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return data;
}
