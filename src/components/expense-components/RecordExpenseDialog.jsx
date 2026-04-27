import { useState } from "react";
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

export function RecordExpenseDialog({
  categories = [],
  open: controlledOpen,
  onOpenChange,
  onSubmit,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  const [entryDate, setEntryDate] = useState(today());
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setEntryDate(today());
    setCategory("");
    setAmount("");
    setRemarks("");
    setError("");
  };

  const amountNum = parseFloat(amount) || 0;
  const canSubmit = category && amountNum > 0 && entryDate && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        date: entryDate,
        category,
        amount: amountNum,
        remarks: remarks.trim() || undefined,
      });
      setOpen(false);
      reset();
    } catch (err) {
      setError(err.message || "Failed to record expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <div className="w-44" onClick={() => setOpen(true)}>
          <CustomButton titleName="Record Expense" icon={GoPlus} />
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) reset();
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Record Manual Expense</DialogTitle>
            <DialogDescription>
              Admin-only entry for expenses not tied to a voucher.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="entryDate">Date</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  max={today()}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categories.length === 0
                          ? "No expense categories"
                          : "Select category"
                      }
                    >
                      {(value) =>
                        categories.find((c) => c._id === value)?.name ||
                        (categories.length === 0
                          ? "No expense categories"
                          : "Select category")
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
              <Label htmlFor="amount">Amount (PHP)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                rows={3}
                placeholder="e.g., Reimbursement for volunteer transport..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!canSubmit}>
                {submitting ? "Recording…" : "Record Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
