"use client";
import { Portal } from "@/components/ui/Portal";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface VerifyLandlordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isVerifying: boolean;
  landlordName?: string;
}

export const VerifyLandlordModal: React.FC<VerifyLandlordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isVerifying,
  landlordName = "Landlord",
}) => {
  React.useEffect(() => {
    // console.log("[VerifyLandlordModal] isOpen:", isOpen);
    if (isOpen) {
      // lock body scroll while open
      // const prev = document.body.style.overflow;
      // document.body.style.overflow = "hidden";
      // return () => {
      //   document.body.style.overflow = prev;
      // };
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <Portal>
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
              Verify {landlordName}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xsm">
              This action can be undone.
            </p>
          </div>

          {/* Body Section */}
          <div className="p-6 flex flex-col items-center">
            <div className="w-full py-4 px-4 flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center mb-8">
                Are you sure you want to verify this landlord?
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
                    "px-6 py-2.5 text-sm rounded-lg bg-lapis dark:bg-lapis text-white font-bold hover:bg-lapis/70 dark:hover:bg-lapis/70 transition-colors shadow-sm cursor-pointer",
                    isVerifying && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
