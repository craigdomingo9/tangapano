import { StudentComponentProps, StudentParams } from "@/lib/types/student";
import ListingNotFound from "../interest/states/ListingNotFound";
import { useRouterPush } from "@/hooks/use-router-push";
import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "@/lib/api/listings";
import ListingDetailHeader from "../listing/ListingDetailHeader";
import ListingDetailHero from "../listing/ListingDetailHero";
import ListingDetailInfo from "../listing/ListingDetailInfo";
import ListingDetailBookingCard from "../listing/ListingDetailBookingCard";
import LoadingScreen from "../interest/states/LoadingScreen";

function ListingDetail({ params, serverData }: StudentComponentProps) {
  console.log(params, serverData);
  const { listingId } = params;
  const { push } = useRouterPush<StudentParams>();

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetchListingById(listingId!!),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 20,
  });

  // console.log(listing);

  if (!listingId) return <ListingNotFound />;
  if (!listing && !isLoading) return <ListingNotFound />;
  if (isLoading || (!listing && isLoading)) return <LoadingScreen />;
  if (isError) return <ListingNotFound />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <ListingDetailHeader />
      <main className="pb-20">
        <ListingDetailHero listing={listing} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <ListingDetailInfo listing={listing!!} />
            <ListingDetailBookingCard listing={listing!!} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListingDetail;
