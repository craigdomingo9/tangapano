import { SearchPageWrapper } from "@/components/student/SearchPageWrapper";
import ExpressInterest from "@/components/student/interest/ExpressInterest";
import SearchPortal from "@/components/student/portal/SearchPortal";
import SearchResults from "@/components/student/results/SearchResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Find your home away from home.",
};

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <SearchPageWrapper
      searchParams={searchParams}
      PortalComponent={SearchPortal}
      ResultsComponent={SearchResults}
      InterestComponent={ExpressInterest}
    />
  );
}

export default Page;
