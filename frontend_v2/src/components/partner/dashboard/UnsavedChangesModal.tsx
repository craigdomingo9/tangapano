import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onDiscard,
  onSave,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 flex flex-col border border-slate-200 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-2 px-6 text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-amber-50 dark:ring-amber-900/10">
            <div className="text-amber-600 dark:text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Unsaved Changes
          </h2>
        </div>

        {/* Body Section */}
        <div className="p-6 pt-2 flex flex-col items-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
            You have unsaved changes. Do you want to save them before leaving?
          </p>

          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={onDiscard}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={onSave}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm cursor-pointer",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
