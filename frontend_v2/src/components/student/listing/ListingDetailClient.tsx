"use client";
import { getListingData } from "@/lib/api/listings";
import ListingNotFound from "../interest/states/ListingNotFound";
import LoadingScreen from "../interest/states/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import Header from "../Header";
import ThemeToggle from "@/components/ui/ThemeToggle";
import HeroImageCarousel from "./HeroImageCarousel";
import ListingInfo from "./ListingInfo";
import ListingFooter from "./ListingFooter";
import { ChevronLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface ListingClientProps {
  slug: string;
}

function ListingDetailClient({ slug }: ListingClientProps) {
  // 1. Because we dehydrated the state on the server,
  // this hook returns data INSTANTLY. No loading state on first render.
  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listing", slug],
    queryFn: () => getListingData(slug),
    // Optional: Keep data fresh for 1 minute before refetching
    staleTime: 1000 * 60 * 5,
  });
  const router = useRouter();

  function onBack() {
    router.push("/student");
  }

  if (isLoading) return <LoadingScreen />; // Only shows if client-side navigation happens later
  if (isError || !listing) return <ListingNotFound />;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-app-bg transition-colors duration-300 font-sans pb-32 sm:pb-24">
      <Header variant="student" className="bg-crimson">
        <div
          className="inline-flex items-center text-sm cursor-pointer rounded-lg backdrop-blur-sm p-2 text-white bg-black/10 hover:bg-black/20"
          onClick={onBack}
        >
          <ChevronLeft />
          <span className="my-auto">Home</span>
        </div>
      </Header>
      <div className="flex-1">
        <HeroImageCarousel listing={listing} />
        <ListingInfo listing={listing} />
      </div>
      <ListingFooter listing={listing} />
    </div>
  );
}

export default ListingDetailClient;
