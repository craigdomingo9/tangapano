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
import ExpressInterestDialog from "../express-interest/ExpressInterestDialog";

interface ListingClientProps {
  listing: any;
}

export default function ListingClient({
  listing: initialListing,
}: ListingClientProps) {
  const listing: Listing = initialListing;

  return (
    <div className="min-h-screen bg-neutral-100 py-6 flex flex-col items-center overflow-y-auto">
      <div className="h-1" />

      {/* Main content container */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        <div className="w-full flex flex-col items-center">
          <ListingCard listing={listing} />
          <div className="flex justify-center my-5">
            <Link href={"/"}>
              <Button className="bg-[var(--ou-crimson)] mt-4 w-[340px] h-14 rounded-b-none cursor-pointer sm:hover:scale-[1.03] transition">
                Check Out More
                <ChevronRight strokeWidth={1.25} />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      {/* Express Interest Dialog */}
      {/* <ContactAgentDialog /> */}
      <ExpressInterestDialog />
    </div>
  );
}
