"use client";
import DashboardHeader from "@/components/dashboard/Header"
import { PlusCircle } from "lucide-react"
import HeaderButton from "@/components/dashboard/HeaderButton"
import MainContentArea from "@/components/dashboard/MainContentArea"
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import ListingsList from "@/components/dashboard/listings/ListingsList";
import AmenitiesDialog from "@/components/dashboard/listings/AmenitiesDialog";
import { PulseLoader } from "react-spinners";
import RoomsDialog from "@/components/dashboard/listings/RoomsDialog";

function page() {

  const {
    data,
    error,
    status,
    isFetching
  } = useQuery({
    queryKey: ['landlord-listings'],
    queryFn: () => {
      return axios.get('/api/landlord-listings/', );
    }
  })

  if (error) {
    console.log(error);
  }

  const listings = data?.data

  return (
    <>
      <div className="flex justify-center">
        <div className="px-2 md:px-14 max-w-4xl w-full [&>div]:w-full [&>div]:px-2 flex flex-col gap-y-6 sm:gap-y-10" style={{ height: 'calc(100vh - 64px)' }}>
          <DashboardHeader 
            HeaderText={{ title: "Listings", description: "Manage your listings here" }}
            Action={
              <HeaderButton>
                <PlusCircle size={20} /> Add New Listing
              </HeaderButton>
            }
          />
          {status === 'pending' && (
            <div className='flex justify-center'>
              <PulseLoader color='var(--primary-bg)' />
            </div>
          )}
          {data && status === 'success' && (
            <MainContentArea 
              HeaderTitle={`Your Listings (${listings?.length})`}
            >
              <ListingsList listings={listings} />
            </MainContentArea>
          )}
        </div>
      </div>
      <AmenitiesDialog />
      <RoomsDialog />
    </>
  )
}

export default page
