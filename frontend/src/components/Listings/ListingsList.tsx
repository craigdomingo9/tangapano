import { InfiniteData } from "@tanstack/react-query";
import ListingCard from "./ListingCard";
import React from "react";

type Props = {
  listings: InfiniteData<any, unknown>;
};

function ListingsList({ listings }: Props) {
  // console.log(listings);

  return (
    <>
      <div className="mt-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 px-2 place-items-center items-center space-y-12">
        {listings?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page?.results?.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default ListingsList;
