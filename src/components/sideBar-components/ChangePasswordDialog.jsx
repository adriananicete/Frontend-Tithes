import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldHelp } from "@/components/shared/FieldHelp";
import { apiFetch } from "@/services/api";

const MIN_LENGTH = 6;

export function ChangePasswordDialog({ open, onOpenChange }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setError("");
    setSuccess("");
    setSubmitAttempted(false);
  };

  const handleOpenChange = (next) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const currentError =
    submitAttempted && !currentPassword ? "Current password is required" : "";

  const newError = !newPassword
    ? submitAttempted ? "New password is required" : ""
    : newPassword.length < MIN_LENGTH
    ? `New password must be at least ${MIN_LENGTH} characters (${newPassword.length}/${MIN_LENGTH})`
    : newPassword === currentPassword
    ? "New password must be different from current"
    : "";

  const confirmError = !confirmPassword
    ? submitAttempted ? "Please confirm your new password" : ""
    : confirmPassword !== newPassword
    ? "Passwords do not match"
    : "";

  const isValid =
    !!currentPassword &&
    newPassword.length >= MIN_LENGTH &&
    newPassword !== currentPassword &&
    confirmPassword === newPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError("");
    setSuccess("");
    if (!isValid) return;

    setSubmitting(true);
    try {
      await apiFetch("/users/change-password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmitAttempted(false);
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  const PasswordField = ({ id, label, value, onChange, show, onToggle, hint, error }) => (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
          autoComplete="new-password"
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <FieldHelp error={error}>{hint}</FieldHelp>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Change Password
          </DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <PasswordField
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent((s) => !s)}
            hint="Required"
            error={currentError}
          />
          <PasswordField
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((s) => !s)}
            hint={`At least ${MIN_LENGTH} characters, different from current`}
            error={newError}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            hint="Must match new password"
            error={confirmError}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              {success ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" disabled={submitting || !!success}>
              {submitting ? "Changing…" : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
