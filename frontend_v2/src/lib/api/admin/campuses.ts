import { axiosInstance } from "../config";

export async function createCampus(accessToken: string, payload: Campus) {
  const { data } = await axiosInstance.post(
    "/campuses/campuses/",
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

export async function updateCampus(
  accessToken: string,
  payload: Partial<Campus>,
  id: string
) {
  const { data } = await axiosInstance.patch(
    `/campuses/campuses/${id}/`,
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
