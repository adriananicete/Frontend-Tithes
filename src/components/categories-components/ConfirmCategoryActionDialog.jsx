import { useEffect, useState } from "react";
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

export function ConfirmCategoryActionDialog({
  category,
  action,
  open,
  onOpenChange,
  onConfirm,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  if (!category || !action) return null;

  const config = {
    archive: {
      title: "Archive category?",
      description: `"${category.name}" will be hidden from new entries but existing records remain linked.`,
      confirmLabel: "Archive",
      pendingLabel: "Archiving…",
      destructive: false,
    },
    restore: {
      title: "Restore category?",
      description: `"${category.name}" will be available for selection again on new entries.`,
      confirmLabel: "Restore",
      pendingLabel: "Restoring…",
      destructive: false,
    },
    delete: {
      title: "Delete category?",
      description: `"${category.name}" will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete permanently",
      pendingLabel: "Deleting…",
      destructive: true,
    },
  }[action];

  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange?.(false);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onConfirm();
      onOpenChange?.(false);
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {config.destructive && <AlertTriangle className="h-5 w-5 text-red-600" />}
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={
              config.destructive ? "bg-red-600 hover:bg-red-700 text-white" : ""
            }
          >
            {submitting ? config.pendingLabel : config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
