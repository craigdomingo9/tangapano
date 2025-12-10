import { axiosInstance } from "../config";

export async function fetchCities(accessToken: string) {
  const { data } = await axiosInstance.get<City[]>("/campuses/cities/", {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });

  return data;
}

export async function createCity(accessToken: string, payload: Partial<City>) {
  const { data } = await axiosInstance.post(
    "/campuses/cities/",
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
