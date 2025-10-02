"use client";

import Loader from "@/components/Loader";
import { axiosInstance } from "@/lib/services/api/config";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ChevronRight } from "lucide-react";
import ListingCard from "@/components/Listings/ListingCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ContactAgentDialog from "@/components/Listings/ContactAgentDialog";

interface ListingClientProps {
  listing: any; // Initial data from server
  slug: string;
}

export default function ListingClient({
  listing: initialListing,
  slug,
}: ListingClientProps) {
  // Use the initial data from server, but allow client-side refetching
  const { data: response, status } = useQuery({
    queryKey: ["listing", slug],
    queryFn: () => axiosInstance.get(`/listings/listing/${slug}?is_full=true`),
    // initialData: { data: initialListing }, // Use server-fetched data as initial data
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const listing = response?.data;

  const fixedListing = {
    ...listing,
    images:
      listing?.images &&
      listing?.images.map((image: any) => ({
        ...image,
        image:
          process.env.NODE_ENV === "production"
            ? `http://tangapano.co.zw${image.image}`
            : `http://localhost${image.image}`,
      })),
  };

  // console.log(fixedListing);

  if (status === "pending") {
    return (
      <div className="flex justify-center overflow-y-auto fullHeight bg-neutral-100 py-6">
        <Loader />
      </div>
    );
  }

  if (status === "error") {
    const message = "Fetching failed. Please try again later.";
    toast.error(message);
    return (
      <div className="flex justify-center overflow-y-auto fullHeight bg-neutral-100 py-6">
        <div className="max-w-3xl flex-1 flex justify-center items-center">
          <AlertCircle className="mr-2" /> {message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-6 flex flex-col items-center overflow-y-auto">
      <div className="h-1" />

      {/* Main content container */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        {status === "success" && (
          <div className="w-full flex flex-col items-center">
            <ListingCard listing={fixedListing} />
            <div className="flex justify-center my-5">
              <Link href={"/"}>
                <Button className="bg-[var(--ou-crimson)] mt-4 w-[340px] h-14 rounded-b-none cursor-pointer sm:hover:scale-[1.03] transition">
                  Check Out More
                  <ChevronRight strokeWidth={1.25} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      {/* Express Interest Dialog */}
      <ContactAgentDialog />
    </div>
  );
}
