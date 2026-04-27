import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const today = () => new Date().toISOString().slice(0, 10);

const toDateInput = (d) => {
  if (!d) return today();
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return today();
  }
};

export function CreateRfDialog({
  categories = [],
  onCreateDraft,
  onCreateAndSubmit,
  editingRf,
  onUpdate,
  open: controlledOpen,
  onOpenChange,
}) {
  const isEdit = !!editingRf;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [entryDate, setEntryDate] = useState(today());
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Seed form when opened — both create (defaults) and edit (existing values).
  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setEntryDate(toDateInput(editingRf.entryDate));
      setCategoryId(editingRf.category?._id || editingRf.category || "");
      setAmount(String(editingRf.estimatedAmount ?? ""));
      setRemarks(editingRf.remarks || "");
    } else {
      setEntryDate(today());
      setCategoryId(categories[0]?._id || "");
      setAmount("");
      setRemarks("");
    }
    setError("");
    setSubmitting(false);
  }, [open, isEdit, editingRf, categories]);

  const buildPayload = () => ({
    entryDate,
    category: categoryId,
    estimatedAmount: Number(amount) || 0,
    remarks,
    attachments: [],
  });

  const runAction = async (action) => {
    setError("");
    setSubmitting(true);
    try {
      await action();
      setOpen(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    runAction(() => onCreateDraft?.(buildPayload()));
  };

  const handleCreateAndSubmit = (e) => {
    e.preventDefault();
    runAction(() => onCreateAndSubmit?.(buildPayload()));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    runAction(() => onUpdate?.(editingRf._id, buildPayload()));
  };

  const canSubmit = !!categoryId && Number(amount) > 0 && !submitting;

  return (
    <>
      {!isEdit && controlledOpen === undefined && (
        <div className="w-full sm:w-40" onClick={() => setOpen(true)}>
          <CustomButton titleName="Create Request" icon={GoPlus} />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? `Edit ${editingRf.rfNo}` : "Create Request Form"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the draft. Submit it for validation when ready."
                : "Fill out the request details. Save as draft or submit for validation."}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="entryDate">Entry Date</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categories.length ? "Select category" : "No RF categories"
                      }
                    >
                      {(value) =>
                        categories.find((c) => c._id === value)?.name ||
                        (categories.length ? "Select category" : "No RF categories")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Estimated Amount (PHP)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Additional context or justification..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 -mb-2">{error}</p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>

              {isEdit ? (
                <Button type="button" onClick={handleUpdate} disabled={!canSubmit}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSaveDraft}
                    disabled={!canSubmit}
                  >
                    {submitting ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateAndSubmit}
                    disabled={!canSubmit}
                  >
                    {submitting ? "Submitting..." : "Submit for Validation"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
