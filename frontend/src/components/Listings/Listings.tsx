"use client";
import { useInView } from "react-intersection-observer";
import useListings from "@/lib/services/api/useListings";
import React, { useEffect } from "react";
import ListingsList from "./ListingsList";
import ContactAgentDialog from "./ContactAgentDialog";
import Loader from "../Loader";
import ListingSkeleton from "./ListingSkeleton";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import ExpressInterestDialog from "@/components/express-interest/ExpressInterestDialog";

type Props = {
  filterParamsURL: string;
};

function Listings({ filterParamsURL }: Props) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isRefetching,
  } = useListings(filterParamsURL);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  return (
    <>
      <div className="max-w-3xl flex-1">
        <div className="space-y-6">
          {(status === "pending" || isRefetching) && (
            <div className="flex flex-col justify-center items-center w-full">
              <Loader className="my-2" />
              <div className="flex flex-col md:flex-row gap-x-4">
                <ListingSkeleton />
                <ListingSkeleton />
              </div>
            </div>
          )}

          {status === "success" && (
            <>
              <div>
                <ListingsList listings={data} />
              </div>

              <div ref={ref} className="py-4 text-center">
                {isFetchingNextPage && (
                  <div className="flex justify-center">
                    <Loader />
                  </div>
                )}
                {!hasNextPage && !isFetchingNextPage && (
                  <div className="col-span-full text-center py-2 text-gray-500 text-sm bg-white rounded-xl shadow-lg">
                    <p className="mb-2">
                      😔 No accommodations found matching your filters.
                    </p>
                    <p>
                      Try adjusting your search criteria or listing your own!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Dialogs */}
      {/* <ContactAgentDialog /> */}
      <ExpressInterestDialog />
    </>
  );
}

export default Listings;
