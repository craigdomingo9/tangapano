"use client";
import { useInView } from 'react-intersection-observer';
import useListings from "@/lib/services/api/useListings";
import React, { useEffect } from 'react';

type Props = {
  filterParamsURL: string,
}

function Listings({filterParamsURL}: Props) {

  const { 
    data, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    status 
  } = useListings(filterParamsURL);

  console.log(data);
  
  const { ref, inView } = useInView();
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-3xl border flex-1">
      <div className="space-y-6">
        {status === 'pending' && <p>Loading properties...</p>}
        {status === 'error' && <p>Error: {error.message}</p>}
        
        {status === 'success' && (
          <>
            {data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.results.map(property => (
                  <div key={property.id} className='h-24 w-24 border flex justify-center items-center' >
                    {property.name}
                  </div>
                ))}
              </React.Fragment>
            ))}
            
            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage && <p>Loading more properties...</p>}
              {!hasNextPage && !isFetchingNextPage && (
                <p>No more properties to load</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Listings