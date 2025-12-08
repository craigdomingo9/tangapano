import { axiosInstance } from "../config";

export async function fetchAgentsAdmin(accessToken: string) {
  const { data } = await axiosInstance.get("/control/users/agents", {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });
  return data;
}

export async function createAgentFn(accessToken: string, payload: any) {
  const { data } = await axiosInstance.post("/control/users/agents/", payload, {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });
  return data;
}

export async function updateAgentFn(
  accessToken: string,
  payload: any,
  id: string
) {
  const { data } = await axiosInstance.patch(
    `/control/users/agents/${id}/`,
    payload,
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );
  return data;
}
