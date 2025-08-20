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

function Page() {
  // TODO: Fetch images seperately
  const { data, error, status } = useQuery({
    queryKey: ["landlord-listings"],
    queryFn: () => {
      return axios.get("/server/api/landlord-listings/");
    },
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
      <div className="flex justify-center">
        <div className="px-2 md:px-14 max-w-4xl w-full [&>div]:w-full [&>div]:px-2 flex flex-col gap-y-6 sm:gap-y-10">
          <DashboardHeader
            HeaderText={{
              title: "Listings",
              description: "Manage your listings here",
            }}
            Action={
              <HeaderButton
                onClick={() => {
                  setDialog(true);
                  setListingDialogOperation("add");
                }}
              >
                <PlusCircle size={20} /> Add New Listing
              </HeaderButton>
            }
          />
          {status === "pending" && (
            <div className="flex flex-col justify-center items-center w-full">
              <Loader className="my-2" />
              <div className="flex flex-col md:flex-row space-x-8">
                <ListingSkeleton />
                <ListingSkeleton />
              </div>
            </div>
          )}
          {data && status === "success" && (
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
