import { axiosInstance } from "../config";

export async function fetchAmenitiesAdmin() {
  const { data } = await axiosInstance.get<Amenity[]>("/listings/amenities/");

  return data;
}

export async function createAmenity(accessToken: string, payload: Amenity) {
  const { data } = await axiosInstance.post(
    "/listings/amenities/",
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

export async function updateAmenity(
  accessToken: string,
  payload: Amenity,
  id: string
) {
  const { data } = await axiosInstance.patch(
    `/listings/amenities/${id}/`,
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
