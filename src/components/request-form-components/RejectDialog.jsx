import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RejectDialog({ rf, open, onOpenChange, onConfirm }) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNote("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!note.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await onConfirm?.(note.trim());
      onOpenChange?.(false);
    } catch (err) {
      setError(err.message || "Failed to reject");
    } finally {
      setSubmitting(false);
    }
  };

  const categoryName =
    typeof rf?.category === "string" ? rf.category : rf?.category?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Request Form</DialogTitle>
          <DialogDescription>
            {rf ? `Reject ${rf.rfNo}${categoryName ? ` — ${categoryName}` : ""}.` : ""}{" "}
            Please provide a reason.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejectionNote">Rejection Note</Label>
          <Textarea
            id="rejectionNote"
            placeholder="Explain why this request is being rejected..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!note.trim() || submitting}
          >
            {submitting ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
