import { axiosInstance } from "../config";

export async function fetchAmenityCategoriesAdmin(accessToken: string) {
  const { data } = await axiosInstance.get<AmenityCategory[]>(
    "/listings/amenity-categories/",
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return data;
}

export async function createAmenityCategory(
  accessToken: string,
  payload: AmenityCategory
) {
  const { data } = await axiosInstance.post(
    "/listings/amenity-categories/",
    {
      ...payload,
    },
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return data;
}
