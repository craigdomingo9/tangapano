import SearchPortal from "@/components/student/portal/SearchPortal";
import SearchResults from "@/components/student/results/SearchResults";
import { StudentFilters } from "@/lib/stores/studentFilterStore";
import { parseSearchParams } from "@/lib/student-utils/search-params-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Find your home away from home.",
};

// --- HELPER: Determine if search is active ---
function hasActiveFilters(filters: StudentFilters): boolean {
  return (
    !!filters.campus ||
    !!filters.neighborhood ||
    filters.selectedPerks.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.roommates !== null ||
    filters.gender !== null ||
    false
  );
}

async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 1. Parse Data
  const filters = parseSearchParams(await searchParams);

  // 2. Determine Mode
  const isResultsMode = hasActiveFilters(filters);

  if (!isResultsMode) {
    return (
      <main>
        <SearchPortal />
      </main>
    );
  }

  if (isResultsMode) {
    return (
      <main>
        <SearchResults filters={filters} />
      </main>
    );
  }
}

export default page;
