import { useEffect, useState } from "react";
import Modal from "../../common-components/Modal";

interface NeighborhoodEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; city_id: string }) => void;
  isExecuting: boolean;
  locations: City[]; // Passed to select the parent city
  parentCityId?: string; // Optional pre-selected city
}

function NeighborhoodEditorModal({
  isExecuting,
  isOpen,
  onClose,
  onSave,
  locations,
  parentCityId,
}: NeighborhoodEditorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    city_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        city_id: parentCityId || "",
      });
    }
  }, [isOpen, parentCityId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Neighborhood"
      subTitle="Define a suburb or area within a city."
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
            {isExecuting ? "Saving..." : "Save"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.city_id}
            onChange={(e) =>
              setFormData({ ...formData, city_id: e.target.value })
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Neighborhood Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Mount Pleasant"
            className="w-full text-sm mt-1.5 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lapis outline-none bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </Modal>
  );
}

export default NeighborhoodEditorModal;
