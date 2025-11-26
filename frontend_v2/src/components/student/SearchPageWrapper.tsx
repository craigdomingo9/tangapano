import SearchPortal from "@/components/student/portal/SearchPortal";
import SearchResults from "@/components/student/results/SearchResults";
import { StudentFilters } from "@/lib/stores/studentFilterStore";
import {
  hasActiveFilters,
  hasNoParams,
  parseSearchParams,
} from "@/lib/student-utils/search-params-utils";

type SearchPageWrapperProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  PortalComponent: React.ComponentType;
  ResultsComponent: React.ComponentType<{ searchParams: any }>;
};

export async function SearchPageWrapper({
  searchParams,
  PortalComponent,
  ResultsComponent,
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
}
