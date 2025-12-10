import { axiosInstance } from "../config";

export async function fetchAmenityCategoriesPartner() {
  const { data } = await axiosInstance.get<AmenityCategory[]>(
    "/listings/amenity-categories/"
  );

  return data;
}
