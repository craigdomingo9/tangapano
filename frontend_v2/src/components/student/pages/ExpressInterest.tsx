import { StudentComponentProps, StudentParams } from "@/lib/types/student";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../interest/states/LoadingScreen";
import ListingNotFound from "../interest/states/ListingNotFound";
import { fetchListingById } from "@/lib/api/listings";
import { FullScreenView } from "@/components/ui/FullScreenView";
import ThemeToggle from "@/components/ui/ThemeToggle";
import StepsOrchestrator from "../interest/StepsOrchestrator";
import { useRouterPush } from "@/hooks/use-router-push";

function ExpressInterest({ params, serverData }: StudentComponentProps) {
  const { listingId } = params;
  const {
    data: listing,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetchListingById(listingId!!),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 20,
  });
  const { push } = useRouterPush<StudentParams>();

  if (isLoading) return <LoadingScreen />;
  if (isError || !listing || !listingId) return <ListingNotFound />;

  console.log(listing);

  return (
    <FullScreenView
      title={`Express Interest ${isSuccess && "in " + listing.title}`}
      onBack={() => push({ page: "home" })}
      action={<ThemeToggle className="text-slate-900 dark:text-white/80" />}
    >
      jk
      <StepsOrchestrator listing={listing} />
    </FullScreenView>
  );
}

export default ExpressInterest;
