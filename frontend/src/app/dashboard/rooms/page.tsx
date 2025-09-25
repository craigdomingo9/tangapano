"use client";
import DashboardHeader from "@/components/dashboard/Header";
import HeaderButton from "@/components/dashboard/HeaderButton";
import RoomsDialog from "@/components/dashboard/listings/rooms/RoomsDialog";
import RoomsSkeleton from "@/components/dashboard/listings/rooms/RoomsSkeleton";
import MainContentArea from "@/components/dashboard/MainContentArea";
import ListingNavigation from "@/components/dashboard/rooms/ListingNavigation";
import ListingRooms from "@/components/dashboard/rooms/ListingRooms";
import Loader from "@/components/Loader";
import {
  useActiveListing,
  useRoomsDialogOperation,
  useRoomsDialogState,
  useSelectedListing,
} from "@/lib/hooks/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle } from "lucide-react";

function page() {
  const { setEntities: setOperation } = useRoomsDialogOperation();
  const { setEntities: setSelectedListing } = useSelectedListing();
  const { entities: activeListing } = useActiveListing();
  const { setEntities: setRoomsDialog } = useRoomsDialogState();

  const { data, error, status, isPending } = useQuery({
    queryKey: ["landlord-listings"],
    queryFn: () => {
      return axios
        .get("/server/api/landlord-listings/")
        .then((response) => response.data);
    },
  });

  return (
    <>
      <div className="flex justify-center dashboardFullHeight bg-neutral-100 overflow-y-auto">
        <div className="h-1"></div>
        <div className="px-2 md:px-14 max-w-4xl w-full [&>div]:w-full flex-1 [&>div]:px-2 flex flex-col sm:gap-y-2">
          <DashboardHeader
            HeaderText={{
              title: "Rooms",
              description: "Manage your rooms here",
            }}
            Action={
              <div className="flex items-center gap-x-2">
                <HeaderButton
                  onClick={() => {
                    setOperation("add");
                    setSelectedListing(activeListing);
                    setRoomsDialog(true);
                  }}
                  disabled={!activeListing.id}
                >
                  <PlusCircle size={20} /> Add New Room
                </HeaderButton>
              </div>
            }
          />
          {(status !== "success" || isPending) && (
            <div className="flex flex-col justify-center items-center w-full">
              <Loader />
              <RoomsSkeleton />
            </div>
          )}
          {data && status === "success" && (
            <MainContentArea className="border-none mt-3">
              <div>
                <ListingNavigation listings={data} />
                <ListingRooms />
              </div>
            </MainContentArea>
          )}
        </div>
      </div>
      <RoomsDialog dismissDialogOnAction />
    </>
  );
}

export default page;
