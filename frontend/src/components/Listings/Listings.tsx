"use client";
import { useInView } from "react-intersection-observer";
import useListings from "@/lib/services/api/useListings";
import React, { useEffect } from "react";
import ListingsList from "./ListingsList";
import ContactAgentDialog from "./ContactAgentDialog";
import Loader from "../Loader";
import ListingSkeleton from "./ListingSkeleton";

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

  return (
    <>
      <div className="max-w-3xl flex-1">
        <div className="space-y-6">
          {(status === "pending" || isRefetching) && (
            <div className="flex flex-col justify-center items-center w-full">
              <Loader className="my-2" />
              <div className="flex flex-col md:flex-row">
                <ListingSkeleton />
                <ListingSkeleton />
              </div>
            </div>
          )}
          {status === "error" && <p>Error: {error.message}</p>}

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
      <ContactAgentDialog />
    </>
  );
}

export default Listings;
