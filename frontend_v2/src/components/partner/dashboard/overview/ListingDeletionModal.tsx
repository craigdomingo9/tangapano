import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface ListingDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const ListingDeletionModal: React.FC<ListingDeletionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-2 px-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Delete Property
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xsm">
            This action cannot be undone.
          </p>
        </div>

        {/* Body Section */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-full py-4 px-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center mb-8">
              Are you sure you want to permanently delete this property listing?
            </p>

            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={cn(
                  "px-6 py-2.5 text-sm rounded-lg bg-crimson dark:bg-red-700 text-white font-bold hover:bg-red-800 dark:hover:bg-red-600 transition-colors shadow-sm cursor-pointer",
                  isDeleting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
