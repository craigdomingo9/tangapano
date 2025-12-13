import { ErrorPage } from "@/components/partner/dashboard/overview/ErrorPage";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";
import { Edit2, GraduationCap, LayoutGrid, MapPin, Plus } from "lucide-react";
import { useMemo } from "react";

interface LocationsTabProps {
  locations: City[];
  setEditCampusOpen: (campus: Campus) => void;
  setAddCityOpen: (val: boolean) => void;
  setAddNeighborhoodOpen: (cityId: string) => void;
  setAddCampusOpen: (val: boolean) => void;
  isLoading: boolean;
  isError: boolean;
}

function LocationsTab({
  locations,
  setEditCampusOpen,
  setAddCityOpen,
  setAddNeighborhoodOpen,
  setAddCampusOpen,
  isLoading,
  isError,
}: LocationsTabProps) {
  // Guards
  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorPage type="500" />;
  if (!locations && !isLoading) return null;

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 backdrop-blur-xl border border-border/40 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-lapis" />
            Active Regions
          </h2>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Grouped by Metropolitan Area
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-center h-20 sm:h-10">
          <button
            onClick={() => setAddCityOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-foreground border border-border/40 rounded-lg text-xs font-bold hover:bg-muted/80 transition-all shadow-sm flex-1 sm:flex-none justify-center group cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            City
          </button>
          <button
            onClick={() => setAddNeighborhoodOpen("")}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-foreground border border-border/40 rounded-lg text-xs font-bold hover:bg-muted/80 transition-all shadow-sm flex-1 sm:flex-none justify-center group cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            Neighborhood
          </button>
          <button
            onClick={() => setAddCampusOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-lapis text-lapis-foreground rounded-lg text-xs font-bold hover:bg-lapis/90 transition-all shadow-lg shadow-lapis/20 flex-1 sm:flex-none justify-center group cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />{" "}
            Add Campus
          </button>
        </div>
      </div>
      <div className="space-y-10">
        {locations.map((location) => (
          <div key={location.id} className="space-y-5">
            {/* City Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/40">
              <div className="p-2 rounded-lg bg-lapis/10 text-lapis border border-lapis/10">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {location.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  {location.campuses.length} Campuses Active
                </p>
              </div>
            </div>

            {/* Campus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {location.campuses.map((campus) => (
                <div
                  key={campus.id}
                  className="group relative bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  {/* Decorative Gradient Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-lapis/0 via-lapis/50 to-lapis/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-lapis/10 to-lapis/5 flex items-center justify-center text-lapis border border-lapis/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base leading-tight">
                          {campus.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {campus.city.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditCampusOpen(campus)}
                      className="p-2 text-muted-foreground hover:text-lapis hover:bg-lapis/10 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                      title="Edit Campus"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wider">
                        Serviced Neighborhoods
                      </span>
                      <div className="h-px flex-1 bg-border/40"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campus.neighborhoods.map((hood, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors cursor-default"
                        >
                          {hood.name}
                        </span>
                      ))}
                      <button
                        onClick={() => setEditCampusOpen(campus)}
                        className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold text-lapis bg-lapis/5 hover:bg-lapis/10 hover:text-lapis transition-colors border border-dashed border-lapis/20 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
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

export default LocationsTab;
