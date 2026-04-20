import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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

// Generic confirmation dialog used for deactivate / activate / delete.
// Parent controls `action` ("deactivate" | "activate" | "delete") to shape the copy.
export function ConfirmUserActionDialog({ user, action, open, onOpenChange, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user || !action) return null;

  const config = {
    deactivate: {
      title: "Deactivate user?",
      description: `${user.name} will not be able to sign in until reactivated. Their data is kept.`,
      confirmLabel: "Deactivate",
      busyLabel: "Deactivating…",
      variant: "default",
    },
    activate: {
      title: "Activate user?",
      description: `${user.name} will regain the ability to sign in.`,
      confirmLabel: "Activate",
      busyLabel: "Activating…",
      variant: "default",
    },
    delete: {
      title: "Delete user?",
      description: `${user.name} will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete permanently",
      busyLabel: "Deleting…",
      variant: "destructive",
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
          <div className="flex items-center gap-2">
            {action === "delete" && <AlertTriangle className="h-5 w-5 text-red-600" />}
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={config.variant}
            onClick={handleConfirm}
            disabled={submitting}
            className={action === "delete" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            {submitting ? config.busyLabel : config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
