"use client";
import ListingNotFound from "../interest/states/ListingNotFound";
import LoadingScreen from "../interest/states/LoadingScreen";
import Header from "../Header";
import HeroImageCarousel from "./HeroImageCarousel";
import ListingInfo from "./ListingInfo";
import ListingFooter from "./ListingFooter";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useListingDetail } from "@/hooks/use-reference-data";

interface ListingClientProps {
  slug: string;
}

function ListingDetailClient({ slug }: ListingClientProps) {
  // 1. Because we dehydrated the state on the server,
  // this hook returns data INSTANTLY. No loading state on first render.
  const { data: listing, isLoading, isError } = useListingDetail(slug);
  const router = useRouter();

  function onBack() {
    router.push("/portal");
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
