import { Portal } from "@/components/ui/Portal";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  containerClassName?: string;
}

function Modal({
  isOpen,
  onClose,
  title,
  subTitle,
  children,
  footer,
  noPadding,
  containerClassName,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // console.log(`${title} isOpen:`, isOpen);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          className={cn(
            "relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800",
            containerClassName
          )}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pt-8 pb-4 px-6 text-center border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xsm ">
              {subTitle}
            </p>
          </div>

          <div className={cn(!noPadding && "p-6 space-y-6")}>
            {children}
            {/* Footer Actions */}
            {footer && (
              <div className="flex gap-3 pt-4 justify-end border-t border-slate-50 dark:border-slate-800">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default Modal;
