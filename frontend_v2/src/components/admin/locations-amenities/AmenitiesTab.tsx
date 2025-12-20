import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { CheckCircle2, Plus, Tag } from "lucide-react";
import { warningToast } from "@/lib/toast";

interface AmenitiesTabProps {
  amenityCategories: AmenityCategory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  setAddAmenity: (amenity: { isOpen: boolean; category_id: string }) => void;
  setAddCategoryOpen: (amenity: boolean) => void;
  setEditAmenity: (amenity: { isOpen: boolean; amenity: Amenity }) => void;
  hasAddAmenityCategoryPermission: boolean;
  hasAddAmenityPermission: boolean;
  hasChangeAmenityPermission: boolean;
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
  hasAddAmenityCategoryPermission,
  hasAddAmenityPermission,
  hasChangeAmenityPermission,
}: AmenitiesTabProps) {
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
        <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap sm:h-10">
          <button
            onClick={() => {
              if (!hasAddAmenityCategoryPermission) {
                warningToast("You don't have permission to add amenity categories");
                return;
              }
              setAddCategoryOpen(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 bg-muted/50 text-foreground border border-border/40 rounded-lg text-xs font-bold transition-all shadow-sm flex-1 sm:flex-none justify-center group ${hasAddAmenityCategoryPermission
              ? "cursor-pointer hover:bg-muted/80"
              : "opacity-70 cursor-not-allowed"
              }`}
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            Category
          </button>
          <button
            onClick={() => {
              if (!hasAddAmenityPermission) {
                warningToast("You don't have permission to add amenities");
                return;
              }
              setAddAmenity({ isOpen: true, category_id: "" });
            }}
            className={`flex items-center gap-2 px-4 py-2 bg-lapis/10 text-lapis border border-lapis/20 rounded-lg text-xs font-bold transition-all shadow-sm flex-1 sm:flex-none justify-center group ${hasAddAmenityPermission
              ? "cursor-pointer hover:bg-lapis/20"
              : "opacity-70 cursor-not-allowed"
              }`}
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            Amenity
          </button>
        </div>
      </div>

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
                  key={amenity.id}
                  onClick={() => {
                    if (!hasChangeAmenityPermission) {
                      warningToast("You don't have permission to edit amenities");
                      return;
                    }
                    setEditAmenity({ isOpen: true, amenity });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-card/60 border border-border/40 rounded-lg text-xs font-bold transition-all ${hasChangeAmenityPermission
                    ? "cursor-pointer hover:border-lapis/50 hover:text-lapis"
                    : "opacity-70 cursor-not-allowed"
                    }`}
                >
                  <Tag className="w-3.5 h-3.5 opacity-70" />
                  <span className="text-xs font-bold">
                    {amenity.display_name}
                  </span>
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
