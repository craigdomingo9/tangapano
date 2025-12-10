import { useEffect, useState } from "react";
import Modal from "../../common-components/Modal";

interface CampusEditorModalProps {
  isOpen: boolean;
  initialData?: Partial<Campus>;
  locations: City[];
  allNeighborhoods: Neighborhood[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    city_id: string;
    neighborhood_ids: string[];
  }) => void;
  isExecuting: boolean;
}

function CampusEditorModal({
  initialData,
  locations,
  allNeighborhoods,
  isExecuting,
  isOpen,
  onClose,
  onSave,
}: CampusEditorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    city_id: "",
    neighborhood_ids: [] as string[], // Store selected IDs
  });

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || "",
        city_id: initialData?.city?.id || "",
        neighborhood_ids: initialData?.neighborhoods?.map((n) => n.id) || [],
      });
    }
  }, [isOpen, initialData]);

  // Derived state: Get neighborhoods that belong to the selected city
  const filteredNeighborhoods = allNeighborhoods?.filter(
    (n) => n.city?.id.toString() === formData.city_id.toString()
  );

  const handleNeighborhoodToggle = (neighborhoodId: string) => {
    setFormData((prev) => {
      const exists = prev.neighborhood_ids.includes(neighborhoodId);
      if (exists) {
        return {
          ...prev,
          neighborhood_ids: prev.neighborhood_ids.filter(
            (id) => id !== neighborhoodId
          ),
        };
      } else {
        return {
          ...prev,
          neighborhood_ids: [...prev.neighborhood_ids, neighborhoodId],
        };
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Edit Campus" : "Add Campus"}
      subTitle="Add a university or college campus location."
      footer={
        <div className="flex gap-3 pt-4 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isExecuting}
            onClick={() => onSave(formData)}
            className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? "Saving..." : "Save Campus"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="grid gap-4">
          {/* Campus Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Campus Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. University of Zimbabwe"
              className="w-full text-sm mt-1.5 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lapis outline-none bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              City <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.city_id}
              onChange={
                (e) =>
                  setFormData({
                    ...formData,
                    city_id: e.target.value,
                    neighborhood_ids: [],
                  }) // Clear neighborhoods when city changes
              }
              className="w-full text-sm mt-1.5 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lapis outline-none bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="" disabled>
                Select City
              </option>
              {locations.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Neighborhoods Multi-Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Associated Neighborhoods
          </label>

          {!formData.city_id ? (
            <div className="text-sm mt-1.5 text-slate-500 italic p-3 border border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
              Please select a city first to view neighborhoods.
            </div>
          ) : filteredNeighborhoods.length === 0 ? (
            <div className="text-sm text-slate-500 italic p-3 border border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
              No neighborhoods found for this city. Add some in the Locations
              tab.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {filteredNeighborhoods.map((neighborhood) => {
                const isSelected = formData.neighborhood_ids.includes(
                  neighborhood.id
                );
                return (
                  <label
                    key={neighborhood.id}
                    className={`
                      cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-colors border select-none
                      ${
                        isSelected
                          ? "bg-lapis text-white border-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:border-sky-600 dark:hover:bg-sky-500" // Selected State
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700" // Unselected State
                      }
                    `}
                  >
                    {/* Hidden input for functionality */}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleNeighborhoodToggle(neighborhood.id)}
                    />
                    {neighborhood.name}
                  </label>
                );
              })}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Select all neighborhoods surrounding this campus.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default CampusEditorModal;
