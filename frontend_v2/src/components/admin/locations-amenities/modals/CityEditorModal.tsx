import { useEffect, useState } from "react";
import Modal from "../../common-components/Modal";

interface CityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => void;
  isExecuting: boolean;
}

function CityEditorModal({
  isExecuting,
  isOpen,
  onClose,
  onSave,
}: CityEditorModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) setName("");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add City"
      subTitle="Create a new metropolitan area."
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
            onClick={() => onSave({ name })}
            className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? "Saving..." : "Create City"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            City Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Harare"
            className="w-full text-sm mt-1.5 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lapis outline-none bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </Modal>
  );
}

export default CityEditorModal;
