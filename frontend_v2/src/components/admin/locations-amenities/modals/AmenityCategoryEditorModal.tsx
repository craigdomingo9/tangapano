import { useEffect, useState, ChangeEvent } from "react";
import Modal from "../../common-components/Modal";

interface AmenityCategoryEditorModalProps {
  isOpen: boolean;
  amenityCategory?: Partial<AmenityCategory>;
  onClose: () => void;
  onSave: (data: Partial<AmenityCategory>) => void;
  isExecuting: boolean;
}

function AmenityCategoryEditorModal({
  amenityCategory,
  isExecuting,
  isOpen,
  onClose,
  onSave,
}: AmenityCategoryEditorModalProps) {
  const [formData, setFormData] = useState<Partial<AmenityCategory>>({
    name: "",
    display_name: "",
  });

  // Helper to create the slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
      .replace(/[\s_-]+/g, "_") // Replace spaces and dashes with single underscore
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: amenityCategory?.name || "",
        display_name: amenityCategory?.display_name || "",
      });
    }
  }, [isOpen, amenityCategory]);

  // Handle display name change and auto-generate slug
  const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      display_name: newDisplayName,
      name: generateSlug(newDisplayName),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={amenityCategory?.id ? "Edit Category" : "Add Category"}
      subTitle="Group amenities together (e.g., 'Room Comfort', 'Security')."
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
            className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm cursor-pointer disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.display_name}
            onChange={handleDisplayNameChange}
            placeholder="e.g. Room Comfort"
            className="w-full text-sm mt-1.5 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lapis outline-none bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
            <span>Internal Name (Slug)</span>
            <span className="text-xs font-normal text-muted-foreground">
              Auto-generated
            </span>
          </label>
          {/* Read Only Input */}
          <input
            type="text"
            readOnly
            value={formData.name}
            placeholder="e.g. room_comfort"
            className="w-full text-sm mt-1.5 px-3 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}

export default AmenityCategoryEditorModal;
