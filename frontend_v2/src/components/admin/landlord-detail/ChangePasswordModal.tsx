import React, { useEffect, useState } from "react";
import Modal from "../common-components/Modal";
import { AlertTriangle, Lock, Shield, AlertCircle } from "lucide-react";

interface ChangePasswordPayload {
  password: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChangePasswordPayload) => void;
  isExecuting: boolean;
}

function ChangePasswordModal({
  isExecuting,
  isOpen,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    setError(null);

    // Validation Rules
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Trigger save
    onSave({ password: newPassword });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isExecuting}
            onClick={handleSubmit}
            className="px-4 py-2 bg-lapis hover:bg-lapis/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-lapis/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isExecuting ? "Updating..." : "Update Password"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Security Info Banner */}
        <div className="p-4 bg-lapis/5 border border-lapis/10 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-lapis/10 rounded-lg shrink-0">
            <Shield className="w-4 h-4 text-lapis" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">
              Security Protocol
            </h4>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              Passwords must be at least 12 characters, including a mix of
              letters, numbers, and special characters.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-medium text-destructive">
              {error}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {/* New Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              New Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lapis transition-colors" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-muted/30 border border-border/40 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lapis/40 focus:border-lapis/50 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-muted/30 border border-border/40 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
              />
            </div>
          </div>
        </div>

        {/* Warning Footer */}
        <div className="flex items-center gap-2 p-3 bg-muted/20 border border-border/20 rounded-xl">
          <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <span className="text-[10px] text-muted-foreground font-medium italic">
            Users will be signed out of all active sessions immediately.
          </span>
        </div>
      </div>
    </Modal>
  );
}

export default ChangePasswordModal;
