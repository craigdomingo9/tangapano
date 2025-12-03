"use client";
import { Card, CardContent } from "@/components/ui/card";
import useStudentFilters, {
  StudentFilters,
} from "@/lib/stores/studentFilterStore";
import LocationFilters from "./LocationFilters";
import { Separator } from "@/components/ui/separator";
import AmenitiesFilter from "./AmenitiesFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import PreferencesFilter from "./PreferencesFilter";
import { Button } from "@/components/ui/button";
import { useRouterPush } from "@/hooks/use-router-push";
import { StudentParams } from "@/lib/types/student";

function SearchCard() {
  const { push } = useRouterPush<StudentParams>();
  const { entities, setEntities } = useStudentFilters();

  const updateFilter = (
    key: keyof StudentFilters,
    value: string | number | null | string[]
  ) => {
    setEntities({
      ...entities,
      [key]: value,
    });
  };

  const filtersNotSet =
    !entities.campus ||
    !entities.roommates ||
    !entities.gender ||
    !entities.minPrice ||
    !entities.maxPrice;

  const handleSearch = () => {
    push({
      page: "search",
      campus: entities.campus!!,
      neighborhood: entities.neighborhood!!,
      max_occupants: entities.roommates?.toString()!!,
      gender: entities.gender!!,
      price_min: entities.minPrice?.toString()!!,
      price_max: entities.maxPrice?.toString()!!,
      amenities: entities.selectedPerks.join(","),
    });
  };

  return (
    <main className="flex-1 z-250 w-full px-4 sm:px-6 lg:px-8 pb-20">
      <Card className="border-0 max-w-[952px] mx-auto shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-slate-100 transition-colors">
        <CardContent className="px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            {/* Main Filters Column */}
            <div className="space-y-8">
              <LocationFilters updateFilter={updateFilter} />
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <AmenitiesFilter updateFilter={updateFilter} />
            </div>
            {/* Sidebar Filters (Price, Preferences) */}
            <div className="space-y-8 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-10">
              <PriceRangeFilter updateFilter={updateFilter} />
              <PreferencesFilter updateFilter={updateFilter} />
              <Button
                onClick={handleSearch}
                className="w-full h-14 text-[1rem] font-bold bg-crimson hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 text-white shadow-xl shadow-crimson/20 rounded-xl mt-4 hover:cursor-pointer"
                disabled={filtersNotSet}
              >
                Search Properties
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default SearchCard;
