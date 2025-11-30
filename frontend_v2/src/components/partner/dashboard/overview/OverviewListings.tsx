import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import ListingCard from "./ListingCard";
import { RouterLink } from "@/routing/RouterLink";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteListing } from "@/lib/api/partner/deleteListing";
import { errorToast, successToast } from "@/lib/toast";
import { Fragment, useState } from "react";
import { ListingDeletionModal } from "./ListingDeletionModal";

interface OverviewListingsProps {
  listings: Listing[];
  accessToken: string;
}

function OverviewListings({ listings, accessToken }: OverviewListingsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (listingId: string) => deleteListing(listingId, accessToken),
    onSuccess: () => {
      successToast("Listing deleted successfully");
      setIsDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["landlord-listings"] });
    },
    onError: () => {
      errorToast("Something went wrong. Please try again later.");
      setIsDeleteOpen(false);
    },
  });

  async function onDeleteListing(listingId: string) {
    await deleteMutation.mutate(listingId);
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Your Properties
        </h1>
        <p className="text-slate-500 text-sm dark:text-slate-400">
          Manage your listings, rooms, and availability.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Home className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No properties listed yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-1 mb-6">
            Get started by adding your first student accommodation property.
          </p>
          <RouterLink to={{ page: "listings", mode: "create" }}>
            <Button className="bg-lapis hover:bg-lapis-hover text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add First Property
            </Button>
          </RouterLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {listings.map((listing) => (
            <Fragment key={listing.id}>
              <ListingCard
                listing={listing}
                setIsDeleteOpen={setIsDeleteOpen}
              />
              {/* <ListingDeletionModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => onDeleteListing(listing.id)}
              /> */}
            </Fragment>
          ))}
        </div>
      )}
    </main>
  );
}

export default OverviewListings;
