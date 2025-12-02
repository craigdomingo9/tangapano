"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface ImageDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemName?: string;
}

export const ImageDeletionModal: React.FC<ImageDeletionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName = "Image",
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
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-red-50 dark:ring-red-900/10">
            <div className="text-red-600 dark:text-red-500">
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
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Delete {itemName}?
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 pt-2 flex flex-col items-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
            This action cannot be undone. Are you sure you want to delete this{" "}
            {itemName.toLowerCase()}?
          </p>

          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-sm text-sm cursor-pointer",
                isDeleting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
