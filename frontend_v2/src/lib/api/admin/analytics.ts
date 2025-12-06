import { axiosInstance } from "../config";

export async function fetchKPIs(accessToken: string) {
  const response = await axiosInstance.get(`/analytics/kpi/`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return response.data;
}

export async function fetchDauChartData(accessToken: string) {
  const response = await axiosInstance.get(`/analytics/charts/dau/`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return response.data;
}

export async function fetchHotProperties(accessToken: string) {
  const response = await axiosInstance.get(`/analytics/top-listings/`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return response.data;
}
