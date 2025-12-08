import React from "react";
import Modal from "../common-components/Modal";
import { Inventory } from "@/lib/api/admin/inventory";
import { AlertTriangle, Unlock } from "lucide-react";

interface ListingLockModalProps {
    isOpen: boolean,
    listing: Inventory,
    onClose: () => void;
    onSave: () => void;
    isLoading: boolean;
}

function ListingLockModal({ isOpen, listing, onClose, onSave, isLoading }: ListingLockModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={listing?.is_locked ? "Unlock Property" : "Lock Property"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 rounded-lg bg-lapis dark:bg-sky-600 text-white font-bold hover:bg-lapis-hover dark:hover:bg-sky-500 transition-colors shadow-sm text-sm cursor-pointer"
          >
            {isLoading
              ? listing?.is_locked
                ? "Unlocking..."
                : "Locking..."
              : listing?.is_locked
              ? "Confirm Unlock"
              : "Confirm Lock"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl border ${
            listing?.is_locked
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-destructive/10 border-destructive/20"
          } flex items-start gap-3`}
        >
          <div
            className={`p-2 rounded-full ${
              listing?.is_locked
                ? "bg-emerald-500/20 text-emerald-500"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            {listing?.is_locked ? (
              <Unlock className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4
              className={`font-bold text-sm ${
                listing?.is_locked ? "text-emerald-500" : "text-destructive"
              }`}
            >
              {listing?.is_locked
                ? "Restore visibility?"
                : "Restrict visibility?"}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {listing?.is_locked
                ? "This action will make the listing visible to students again. Ensure any moderation issues have been resolved."
                : "This will hide the listing from search results immediately. The landlord will be notified."}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ListingLockModal;
