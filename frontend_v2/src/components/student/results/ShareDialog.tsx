import { Button } from "@/components/ui/button";
import { Check, Copy, Share2, XIcon } from "lucide-react";
import { useState } from "react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  isPartner?: boolean;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  listing,
  isPartner,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !listing) return null;

  // Simulate a public URL for the listing
  const domain = window.location.origin;
  const shareUrl = `${domain}/listing/${listing.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10 cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="pt-8 pb-4 px-6 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-3 border border-slate-100 dark:border-slate-700 text-lapis dark:text-sky-400">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Share Property
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isPartner
              ? "Share this link with potential tenants."
              : "Share this link with friends."}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
              Property Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xsm text-slate-600 dark:text-slate-300 font-medium truncate select-all">
                {shareUrl}
              </div>
              <Button
                onClick={handleCopy}
                className={`shrink-0 min-w-[100px] transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Anyone with this link can view the property details and apply.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant={"outline"}
              className="w-full dark:border-sky-700 dark:text-sky-400 dark:hover:bg-sky-900/20 dark:bg-slate-900 cursor-pointer outline-lapis hover:bg-lapis/5 "
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
