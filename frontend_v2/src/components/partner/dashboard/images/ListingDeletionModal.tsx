import { Trash, X } from "lucide-react";
import * as React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Property",
  description = "Are you sure you want to permanently delete this property listing? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-2 px-6 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50 dark:ring-red-900/10">
            <Trash className="w-6 h-6 text-crimson dark:text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* Body Section */}
        <div className="p-6 pt-2 flex flex-col items-center">
          <p className="text-base font-medium text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
            {description}
          </p>

          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-2.5 rounded-lg bg-crimson dark:bg-red-700 text-white font-bold hover:bg-red-800 dark:hover:bg-red-600 transition-colors shadow-sm shadow-red-900/20"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
