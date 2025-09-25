import { cn } from "@/lib/utils";
import ListingCard from "./ListingCard";
import { useSidebar } from "@/components/ui/sidebar";

type Props = {
  listings: Listing[];
};

function ListingsList({ listings }: Props) {
  const { isMobile, state } = useSidebar();
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-items-center sm:place-items-start gap-6 pb-4",
        !isMobile &&
          state === "expanded" &&
          "sm:grid-cols-1 items-center place-items-center"
      )}
    >
      {listings?.map((listing: Listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default ListingsList;
