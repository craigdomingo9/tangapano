import {
  fetchDauChartData,
  fetchKPIs,
  fetchListingPerformance,
} from "@/lib/api/admin/analytics";
import { useQuery } from "@tanstack/react-query";

function useDashboardAnalytics(accessToken: string) {
  const {
    data: kpis,
    isLoading: kpiIsLoading,
    isError: kpiIsError,
  } = useQuery({
    queryKey: ["kpi"],
    queryFn: () => fetchKPIs(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: dauChartData,
    isLoading: chartIsLoading,
    isError: dauChartIsError,
  } = useQuery({
    queryKey: ["dau_chart"],
    queryFn: () => fetchDauChartData(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: hotProperties,
    isLoading: hotPropertiesIsLoading,
    isError: hotPropertiesIsError,
  } = useQuery({
    queryKey: ["hot_properties"],
    queryFn: () => fetchListingPerformance(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  return {
    kpis,
    kpiIsLoading,
    kpiIsError,
    dauChartData,
    chartIsLoading,
    dauChartIsError,
    hotProperties,
    hotPropertiesIsLoading,
    hotPropertiesIsError,
  };
}

export default useDashboardAnalytics;
