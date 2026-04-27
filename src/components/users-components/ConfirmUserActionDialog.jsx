import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";

// Generic confirmation dialog used for deactivate / activate / delete.
// Parent controls `action` ("deactivate" | "activate" | "delete") to shape the copy.
export function ConfirmUserActionDialog({ user, action, open, onOpenChange, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user || !action) return null;

  if (action === "delete") {
    return (
      <ConfirmActionDialog
        open={open}
        onOpenChange={onOpenChange}
        variant="delete"
        title="Delete this user?"
        description={`${user.name} will be permanently removed. This cannot be undone.`}
        confirmLabel="Yes, delete"
        pendingLabel="Deleting…"
        onConfirm={onConfirm}
      />
    );
  }

  const config = {
    deactivate: {
      title: "Deactivate user?",
      description: `${user.name} will not be able to sign in until reactivated. Their data is kept.`,
      confirmLabel: "Deactivate",
      busyLabel: "Deactivating…",
    },
    activate: {
      title: "Activate user?",
      description: `${user.name} will regain the ability to sign in.`,
      confirmLabel: "Activate",
      busyLabel: "Activating…",
    },
  }[action];

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await onConfirm?.();
      onOpenChange?.(false);
    } catch (err) {
      setError(err.message || "Action failed");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm} disabled={submitting}>
            {submitting ? config.busyLabel : config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
