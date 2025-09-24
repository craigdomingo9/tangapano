"use client";
import DashboardHeader from "@/components/dashboard/Header";
import { AlertCircle, PlusCircle } from "lucide-react";
import HeaderButton from "@/components/dashboard/HeaderButton";
import MainContentArea from "@/components/dashboard/MainContentArea";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ListingsList from "@/components/dashboard/listings/ListingsList";
import RoomsDialog from "@/components/dashboard/listings/rooms/RoomsDialog";
import AmenitiesDialog from "@/components/dashboard/listings/amenities/AmenitiesDialog";
import ListingImageDialog from "@/components/dashboard/listings/images/ListingImageDialog";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import ListingSkeleton from "@/components/dashboard/listings/ListingSkeleton";
import { useListingDialogMode, useListingDialogState } from "@/lib/hooks/store";
import ListingDialog from "@/components/dashboard/listings/listing/ListingDialog";
import { axiosInstance } from "@/lib/services/api/config";
import { useEffect, useState } from "react";

function Page() {
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await axios.get("/server/api/auth/verify-token");
        setAuthToken(response.data.token);
        return;
      } catch (error) {
        console.error("Error fetching API token:", error);
      }
    }
    fetchToken();
  }, []);

  const { data, error, status, isPending } = useQuery({
    queryKey: ["landlord-listings"],
    queryFn: () => {
      return axiosInstance.get("/listings/landlord-listings/", {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
    },
    enabled: !!authToken,
  });

  const { setEntities: setDialog } = useListingDialogState();
  const { setEntities: setListingDialogOperation } = useListingDialogMode();

  if (status === "error") {
    const message = "Fetching failed. Please try again later.";
    toast.error(message);

    return (
      <div className="flex fullHeight items-center justify-center">
        <div></div>
        <div className="max-w-3xl flex-1 flex justify-center items-center">
          <AlertCircle className="" /> {message}
        </div>
      </div>
    );
  }

  const listings = data?.data;

  return (
    <>
      <div className="flex justify-center bg-neutral-100">
        <div className="px-2 md:px-14 max-w-4xl w-full [&>div]:w-full [&>div]:px-2 flex flex-col sm:gap-y-2">
          <DashboardHeader
            HeaderText={{
              title: "Listings",
              description: "Manage your listings here",
            }}
            Action={
              <div className="flex items-center gap-x-2">
                <HeaderButton
                  onClick={() => {
                    setDialog(true);
                    setListingDialogOperation("add");
                  }}
                >
                  <PlusCircle size={20} /> Add New Listing
                </HeaderButton>
              </div>
            }
          />
          {(status !== "success" || isPending) && (
            <div className="flex flex-col justify-center items-center w-full">
              <Loader className="my-2" />
              <div className="flex flex-col md:flex-row md:space-x-8">
                <ListingSkeleton />
                <ListingSkeleton />
              </div>
            </div>
          )}
          {status === "success" && listings?.length === 0 && (
            <MainContentArea HeaderTitle="Your Listings (0)">
              <div className="w-full h-48 flex flex-col justify-center items-center">
                <p className="text-gray-500 text-sm text-center">
                  You have no listings yet. Click the button above to add your
                  first listing.
                </p>
              </div>
            </MainContentArea>
          )}
          {listings?.length > 0 && status === "success" && (
            <MainContentArea
              HeaderTitle={`Your Listings (${listings?.length})`}
            >
              <ListingsList listings={listings} />
            </MainContentArea>
          )}
          <div className="h-12 border border-transparent"></div>
        </div>
      </div>
      {/* Dialogs */}
      <AmenitiesDialog />
      <RoomsDialog />
      <ListingDialog />
      <ListingImageDialog />
    </>
  );
}

export default Page;
