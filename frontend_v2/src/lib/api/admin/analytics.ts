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

export async function fetchListingPerformance(
  accessToken: string,
  limit: number = 5
) {
  const response = await axiosInstance.get(
    `/analytics/top-listings` + `?num_listings=${limit}`,
    {
      headers: { Authorization: `Token ${accessToken}` },
    }
  );
  return response.data;
}

export async function fetchRegionalInterest(accessToken: string) {
  const response = await axiosInstance.get(`/analytics/regional-interest/`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return response.data;
}

export async function fetchDemographics(accessToken: string) {
  const response = await axiosInstance.get(`/analytics/demographics/`, {
    headers: { Authorization: `Token ${accessToken}` },
  });
  return response.data;
}
