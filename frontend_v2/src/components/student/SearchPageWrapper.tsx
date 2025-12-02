import SearchPortal from "@/components/student/home/SearchPortal";
import SearchResults from "@/components/student/results/SearchResults";
import { StudentFilters } from "@/lib/stores/studentFilterStore";
import {
  hasActiveFilters,
  hasExpressParams,
  hasNoParams,
  parseSearchParams,
} from "@/lib/student-utils/search-params-utils";

type SearchPageWrapperProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  PortalComponent: React.ComponentType;
  ResultsComponent: React.ComponentType<{ searchParams: any }>;
  InterestComponent: React.ComponentType<{ searchParams: any }>;
};

export async function SearchPageWrapper({
  searchParams,
  PortalComponent,
  ResultsComponent,
  InterestComponent,
}: SearchPageWrapperProps) {
  const params = await searchParams;

  // If no params at all, show portal
  if (hasNoParams(params)) {
    return (
      <main>
        <PortalComponent />
      </main>
    );
  }

  if (hasActiveFilters(parseSearchParams(params)))
    return (
      <main>
        <ResultsComponent searchParams={params} />
      </main>
    );

  if (hasExpressParams(params)) {
    return (
      <main>
        <InterestComponent searchParams={params} />
      </main>
    );
  }
}
