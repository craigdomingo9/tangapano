import { axiosInstance } from "../config";

export async function fetchNeighborhoods(accessToken: string) {
  const { data } = await axiosInstance.get<Neighborhood[]>(
    "/campuses/neighborhoods/",
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return data;
}

export async function createNeighborhood(
  accessToken: string,
  payload: Neighborhood
) {
  const { data } = await axiosInstance.post(
    "/campuses/neighborhoods/",
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
