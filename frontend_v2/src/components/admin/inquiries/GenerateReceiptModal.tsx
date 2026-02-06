import { Button } from "@/components/ui/button";
import { DollarSign, DoorClosed, DoorOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "../common-components/Modal";

// Assuming Inquiry type is defined globally or imported
interface GenerateReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inquiry: Inquiry, depositFee: number, closeRoom: boolean) => void;
  inquiry: Inquiry | null;
  isExecuting?: boolean;
}

export function GenerateReceiptModal({
  isOpen,
  onClose,
  onConfirm,
  inquiry,
  isExecuting = false,
}: GenerateReceiptModalProps) {
  const [depositFee, setDepositFee] = useState<string>("");
  const [closeRoom, setCloseRoom] = useState<boolean>(true);

  // Reset state when modal opens/closes or inquiry changes
  useEffect(() => {
    if (isOpen) {
      setDepositFee("");
      setCloseRoom(true);
    }
  }, [isOpen, inquiry]);

  const handleSubmit = () => {
    if (!inquiry) return;
    const fee = parseFloat(depositFee) || 0;
    onConfirm(inquiry, fee, closeRoom);
  };

  if (!inquiry) return null;

  return (
    <Modal
      title={`Generate Receipt for ${inquiry.full_name}`}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <Button
            disabled={isExecuting || !depositFee}
            onClick={handleSubmit}
            className="px-4 py-2 bg-lapis hover:bg-lapis/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-lapis/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isExecuting ? "Generating..." : "Generate Receipt"}
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        {/* Deposit Fee Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Deposit Fee Amount
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={depositFee}
              onChange={(e) => setDepositFee(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-lapis/50 focus:border-lapis transition-all text-sm"
            />
          </div>
        </div>

        {/* Close Room Slider (Custom Toggle) */}
        <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/40 rounded-xl">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              {closeRoom ? (
                <DoorClosed className="w-4 h-4 text-amber-500" />
              ) : (
                <DoorOpen className="w-4 h-4 text-emerald-500" />
              )}
              Close Room Listing
            </label>
            <p className="text-xs text-muted-foreground">
              Mark this listing as unavailable after receipt.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={closeRoom}
            onClick={() => setCloseRoom(!closeRoom)}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
              focus-visible:ring-lapis focus-visible:ring-offset-2
              ${closeRoom ? "bg-lapis" : "bg-muted-foreground/30"}
            `}
          >
            <span
              aria-hidden="true"
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                transition duration-200 ease-in-out
                ${closeRoom ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
}
