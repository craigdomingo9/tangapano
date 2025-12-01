import Header from "@/components/student/Header";
import PartnerHeaderContent from "../PartnerHeaderContent";
import { RouteProps } from "@/routing/types";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/config";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import fetchLandlordListings from "@/lib/api/partner/fetchLandlordListings";
import OverviewListings from "../overview/OverviewListings";
import OverviewFooter from "../overview/OverviewFooter";
import { ErrorPage } from "../overview/ErrorPage";

function Overview({ serverData }: RouteProps) {
  const { user, accessToken } = serverData;

  // 1. Client-Side Fetch
  const { data, isError, isLoading, refetch, error } = useQuery<
    Listing[],
    AxiosError
  >({
    queryKey: ["landlord-listings"],
    queryFn: () => fetchLandlordListings(accessToken),
  });

  // console.log(data, error);

  if (isLoading) return <LoadingScreen />;
  if (isError || !data) {
    const status = error?.response?.status; // e.g., 404, 500, 401

    if (status === 404) return <ErrorPage type="404" refreshFn={refetch} />;
    if (status === 403 || status === 401 || status === 400)
      return <ErrorPage type="access" refreshFn={refetch} />;
    return <ErrorPage type="500" refreshFn={refetch} />;
  }

  return (
    <div>
      {/* Header */}
      <Header variant="business" sticky className="dark:bg-app-header">
        <PartnerHeaderContent user={user} accessToken={accessToken} />
      </Header>
      {/* Listings Grid */}
      <OverviewListings listings={data} accessToken={accessToken} />
      {/* Footer */}
      <OverviewFooter />
    </div>
  );
}

export default Overview;
