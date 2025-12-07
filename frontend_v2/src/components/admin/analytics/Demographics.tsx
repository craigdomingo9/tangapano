import React, { useState } from "react";
import TopCampuses from "./TopCampuses";
import useAnalytics from "@/hooks/admin/use-analytics";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import DeviceBreakdown from "./DeviceBreakdown";
import ListingPerformance from "./ListingPerformance";

interface DemographicsProps {
  accessToken: string;
}

function Demographics({ accessToken }: DemographicsProps) {
  const {
    regionalInterest,
    regionalInterestIsError,
    regionalInterestIsLoading,
    demographics,
    demographicsIsError,
    demographicsIsLoading,
    listingPerformance,
    listingPerformanceIsError,
    listingPerformanceIsLoading,
  } = useAnalytics(accessToken);

  if (regionalInterestIsLoading) return <LoadingScreen />;
  if (regionalInterestIsError) return <ErrorPage type="500" />;

  return (
    <>
      <ListingPerformance
        data={listingPerformance}
        isLoading={listingPerformanceIsLoading}
        isError={listingPerformanceIsError}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <TopCampuses
          data={regionalInterest}
          isLoading={regionalInterestIsLoading}
          isError={regionalInterestIsError}
        />
        <DeviceBreakdown
          data={demographics?.devices}
          isLoading={demographicsIsLoading}
          isError={demographicsIsError}
        />
      </div>
    </>
  );
}

export default Demographics;
