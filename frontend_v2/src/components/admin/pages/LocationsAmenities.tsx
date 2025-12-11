import { useState } from "react";

// --- Components ---
import LATabs from "../locations-amenities/LATabs";
import AmenitiesTab from "../locations-amenities/AmenitiesTab";
import LocationsTab from "../locations-amenities/LocationsTab";

// --- Hooks ---
import useLocationsAdmin from "@/hooks/admin/use-locations";
import useNeighborhoodAdmin from "@/hooks/admin/use-neighborhoods";
import useCampusesAdmin from "@/hooks/admin/use-campuses";
import useAmenityCategoriesAdmin from "@/hooks/admin/use-amenity-categories";
import useAmenitiesAdmin from "@/hooks/admin/use-amenities";

// --- Modals ---
import AmenityEditorModal from "../locations-amenities/modals/AmenityEditorModal";
import AmenityCategoryEditorModal from "../locations-amenities/modals/AmenityCategoryEditorModal";
import CampusEditorModal from "../locations-amenities/modals/CampusEditorModal";
import CityEditorModal from "../locations-amenities/modals/CityEditorModal";
import NeighborhoodEditorModal from "../locations-amenities/modals/NeighborhoodEditorModal";
import { AdminPanelComponentProps } from "@/lib/types/admin";

function LocationsAmenities({ serverData }: AdminPanelComponentProps) {
  const { accessToken } = serverData;

  // --- 1. Data Hooks ---

  const {
    amenityCategories,
    amenityCategoriesIsLoading,
    amenityCategoriesIsError,
    addAmenityCategory,
    isAddingAmenityCategory,
  } = useAmenityCategoriesAdmin(accessToken);

  const { addAmenity, isAddingAmenity, editAmenity, isEditingAmenity } =
    useAmenitiesAdmin(accessToken);

  const {
    locations,
    locationsIsLoading,
    locationsIsError,
    addCity,
    isAddingCity,
  } = useLocationsAdmin(accessToken);

  const { neighborhoods, addNeighborhood, isAddingNeighborhood } =
    useNeighborhoodAdmin(accessToken);

  const { addCampus, isAddingCampus, editCampus, isEditingCampus } =
    useCampusesAdmin(accessToken);

  // --- 2. UI State ---
  const [activeTab, setActiveTab] = useState<"locations" | "amenities">(
    "locations"
  );

  // --- 3. Modal State Management ---

  // -- Location: City --
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // -- Location: Neighborhood --
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  // We use Partial because we might open the modal empty
  const [neighborhoodFormData, setNeighborhoodFormData] = useState<
    Partial<Neighborhood>
  >({});

  // -- Location: Campus --
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [campusFormData, setCampusFormData] = useState<Partial<Campus>>({});
  const [isEditingCampusMode, setIsEditingCampusMode] = useState(false);

  // -- Amenity: Category --
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<
    Partial<AmenityCategory>
  >({
    display_name: "",
    name: "",
  });

  // -- Amenity: Item --
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [amenityFormData, setAmenityFormData] = useState<Partial<Amenity>>({});
  const [isEditingAmenityMode, setIsEditingAmenityMode] = useState(false);

  // --- 4. Handlers ---

  // City Handlers
  const handleSaveCity = (data: { name: string }) => {
    addCity(data, { onSuccess: () => setIsCityModalOpen(false) });
  };

  // Neighborhood Handlers
  const handleOpenAddNeighborhood = () => {
    setNeighborhoodFormData({});
    setIsNeighborhoodModalOpen(true);
  };

  const handleSaveNeighborhood = (data: any) => {
    // API likely expects { name: string, city_id: string }
    addNeighborhood(data, {
      onSuccess: () => setIsNeighborhoodModalOpen(false),
    });
  };

  // Campus Handlers
  const handleOpenAddCampus = () => {
    setCampusFormData({});
    setIsEditingCampusMode(false);
    setIsCampusModalOpen(true);
  };

  const handleOpenEditCampus = (campus: Campus) => {
    setCampusFormData(campus);
    setIsEditingCampusMode(true);
    setIsCampusModalOpen(true);
  };

  const handleSaveCampus = (data: any) => {
    // console.log(data);
    // Data here likely needs to contain { city_id: string, agent_id: string, name: string, etc }
    if (isEditingCampusMode && campusFormData.id) {
      editCampus(
        { id: campusFormData.id, data },
        {
          onSuccess: () => setIsCampusModalOpen(false),
        }
      );
    } else {
      addCampus(data, {
        onSuccess: () => setIsCampusModalOpen(false),
      });
    }
  };

  // Amenity Handlers
  const handleSaveAmenityCategory = (data: any) => {
    addAmenityCategory(data, {
      onSuccess: () => setIsCategoryModalOpen(false),
    });
  };

  const handleOpenAddAmenity = () => {
    setAmenityFormData({});
    setIsEditingAmenityMode(false);
    setIsAmenityModalOpen(true);
  };

  const handleOpenEditAmenity = (amenity: Amenity) => {
    setAmenityFormData(amenity);
    setIsEditingAmenityMode(true);
    setIsAmenityModalOpen(true);
  };

  const handleSaveAmenity = (data: any) => {
    // Data needs { category_id: string, name: string, ... }
    if (isEditingAmenityMode && amenityFormData.id) {
      editAmenity(
        { id: amenityFormData.id, data },
        {
          onSuccess: () => setIsAmenityModalOpen(false),
        }
      );
    } else {
      addAmenity(data, {
        onSuccess: () => setIsAmenityModalOpen(false),
      });
    }
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              System Configuration
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage campuses, neighborhoods, and property features.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <LATabs
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
        />

        {/* Content */}
        <div className="min-h-[400px] animate-slide-up">
          {activeTab === "locations" ? (
            <LocationsTab
              locations={locations || []}
              isLoading={locationsIsLoading}
              isError={locationsIsError}
              setAddCityOpen={() => setIsCityModalOpen(true)}
              setAddNeighborhoodOpen={handleOpenAddNeighborhood}
              setAddCampusOpen={handleOpenAddCampus}
              setEditCampusOpen={handleOpenEditCampus}
            />
          ) : (
            <AmenitiesTab
              amenityCategories={amenityCategories || []}
              isLoading={amenityCategoriesIsLoading}
              isError={amenityCategoriesIsError}
              setAddCategoryOpen={() => setIsCategoryModalOpen(true)}
              setAddAmenity={handleOpenAddAmenity}
              setEditAmenity={handleOpenEditAmenity}
            />
          )}
        </div>
      </div>

      {/* --- MODALS --- */}

      <AmenityEditorModal
        isOpen={isAmenityModalOpen}
        onClose={() => setIsAmenityModalOpen(false)}
        onSave={handleSaveAmenity}
        initialData={amenityFormData}
        isExecuting={isAddingAmenity || isEditingAmenity}
        categories={amenityCategories || []}
      />

      <AmenityCategoryEditorModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveAmenityCategory}
        amenityCategory={categoryFormData as AmenityCategory}
        isExecuting={isAddingAmenityCategory}
      />

      <CampusEditorModal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
        onSave={handleSaveCampus}
        initialData={campusFormData}
        isExecuting={isAddingCampus || isEditingCampus}
        locations={locations || []}
        allNeighborhoods={neighborhoods!!}
      />

      <CityEditorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSave={handleSaveCity}
        isExecuting={isAddingCity}
      />

      <NeighborhoodEditorModal
        isOpen={isNeighborhoodModalOpen}
        onClose={() => setIsNeighborhoodModalOpen(false)}
        onSave={handleSaveNeighborhood}
        isExecuting={isAddingNeighborhood}
        locations={locations || []} // To select City
      />
    </>
  );
}

export default LocationsAmenities;
