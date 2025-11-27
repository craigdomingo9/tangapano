"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "@/lib/api/listings";
import { FullScreenView } from "@/components/ui/FullScreenView";
import ListingNotFound from "./states/ListingNotFound";
import LoadingScreen from "./states/LoadingScreen";
import StepsOrchestrator from "./StepsOrchestrator";
import DarkThemeToggle from "@/components/ui/DarkThemeToggle";

export default function ExpressInterestView({
  listingId,
}: {
  listingId: string;
}) {
  // 1. Fetch from Cache (Instant because of server hydration)
  const {
    data: listing,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => fetchListingById(listingId),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 20,
  });

  if (isLoading) return <LoadingScreen />;
  if (isError || !listing) return <ListingNotFound />;

  return (
    <FullScreenView
      title={`Express Interest ${isSuccess && "in " + listing.title}`}
      onBack={() => window.history.back()}
      action={<DarkThemeToggle className="text-slate-900 dark:text-white/80" />}
    >
      <StepsOrchestrator listing={listing} />
    </FullScreenView>
  );
}
