import {
  fetchDemographics,
  fetchListingPerformance,
  fetchRegionalInterest,
} from "@/lib/api/admin/analytics";
import { useQuery } from "@tanstack/react-query";

function useAnalytics(accessToken: string) {
  const {
    data: regionalInterest,
    isLoading: regionalInterestIsLoading,
    isError: regionalInterestIsError,
  } = useQuery({
    queryKey: ["regional_interest"],
    queryFn: () => fetchRegionalInterest(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: demographics,
    isLoading: demographicsIsLoading,
    isError: demographicsIsError,
  } = useQuery({
    queryKey: ["demographics"],
    queryFn: () => fetchDemographics(accessToken),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: listingPerformance,
    isLoading: listingPerformanceIsLoading,
    isError: listingPerformanceIsError,
  } = useQuery({
    queryKey: ["listing_performance"],
    queryFn: () => fetchListingPerformance(accessToken, 1000),
    staleTime: 1000 * 60 * 5,
  });

  return {
    regionalInterest,
    regionalInterestIsLoading,
    regionalInterestIsError,
    demographics,
    demographicsIsLoading,
    demographicsIsError,
    listingPerformance,
    listingPerformanceIsLoading,
    listingPerformanceIsError,
  };
}

export default useAnalytics;
