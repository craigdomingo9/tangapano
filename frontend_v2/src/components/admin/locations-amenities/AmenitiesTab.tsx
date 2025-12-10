import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { CheckCircle2, Plus, Tag } from "lucide-react";

interface AmenitiesTabProps {
  amenityCategories: AmenityCategory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  setAddAmenity: (amenity: boolean) => void;
  setAddCategoryOpen: (amenity: boolean) => void;
  setEditAmenity: (amenity: Amenity) => void;
}

interface GroupedAmenities {
  group: Amenity[];
}

function AmenitiesTab({
  amenityCategories,
  isLoading,
  isError,
  setAddAmenity,
  setEditAmenity,
  setAddCategoryOpen,
}: AmenitiesTabProps) {
  // Guards
  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorPage type="500" />;
  if (!amenityCategories && !isLoading) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 backdrop-blur-xl border border-border/40 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Amenity Configuration
          </h2>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Manage standard features for listings
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setAddCategoryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-foreground border border-border/40 rounded-lg text-xs font-bold hover:bg-muted/80 transition-all shadow-sm flex-1 sm:flex-none justify-center group cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            Add Category
          </button>
          <button
            onClick={() => setAddAmenity(true)}
            className="flex items-center gap-2 px-4 py-2 bg-lapis text-lapis-foreground rounded-lg text-xs font-bold hover:bg-lapis/90 transition-all shadow-lg shadow-lapis/20 flex-1 sm:flex-none justify-center group cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            Add Amenity
          </button>
        </div>
      </div>

      {/* Categorized Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {amenityCategories?.map((category) => (
          <div
            key={category.name}
            className="p-6 border border-border/60 rounded-2xl bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/30 pb-2">
              {category.display_name}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {category?.amenities?.map((amenity, i) => (
                <div
                  key={i}
                  className="group relative"
                  onClick={() => setEditAmenity(amenity)}
                >
                  <div className="flex items-center text-muted-foreground gap-2 px-3 py-1.5 bg-muted/40 border border-border/40 rounded-lg shadow-sm cursor-pointer hover:border-lapis/50 hover:text-lapis transition-all duration-300">
                    <Tag className="w-3.5 h-3.5 opacity-70" />
                    <span className="text-xs font-bold">
                      {amenity.display_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmenitiesTab;
