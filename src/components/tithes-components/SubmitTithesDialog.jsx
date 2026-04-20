import { useMemo, useState } from "react";
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
import { DENOMINATIONS, formatPHP, SERVICE_TYPES } from "./tithesUtils";

const today = () => new Date().toISOString().slice(0, 10);

export function SubmitTithesDialog({ open: controlledOpen, onOpenChange, onSubmit }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };
  const [entryDate, setEntryDate] = useState(today());
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [remarks, setRemarks] = useState("");
  const [qtys, setQtys] = useState(() =>
    Object.fromEntries(DENOMINATIONS.map((b) => [b, 0]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => DENOMINATIONS.reduce((sum, b) => sum + b * (qtys[b] || 0), 0),
    [qtys]
  );

  const setQty = (bill, value) => {
    const n = Math.max(0, parseInt(value || "0", 10) || 0);
    setQtys((prev) => ({ ...prev, [bill]: n }));
  };

  const reset = () => {
    setEntryDate(today());
    setServiceType(SERVICE_TYPES[0]);
    setRemarks("");
    setQtys(Object.fromEntries(DENOMINATIONS.map((b) => [b, 0])));
    setSubmitting(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const denominations = DENOMINATIONS
        .filter((bill) => (qtys[bill] || 0) > 0)
        .map((bill) => ({
          bill,
          qty: qtys[bill],
          subtotal: bill * qtys[bill],
        }));
      const payload = {
        entryDate,
        serviceType,
        denominations,
        total,
        ...(remarks ? { remarks } : {}),
      };
      await onSubmit?.(payload);
      setOpen(false);
      reset();
    } catch (err) {
      setError(err.message || "Failed to submit tithes");
      setSubmitting(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <div className="w-full sm:w-40" onClick={() => setOpen(true)}>
          <CustomButton titleName="Submit New Tithes" icon={GoPlus} />
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) reset();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Submit New Tithes</DialogTitle>
          <DialogDescription>
            Enter denomination breakdown; total auto-computes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label>Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Denominations</Label>
            <div className="rounded-md border divide-y">
              <div className="grid grid-cols-3 px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                <div>Bill</div>
                <div>Quantity</div>
                <div className="text-right">Subtotal</div>
              </div>
              {DENOMINATIONS.map((bill) => {
                const qty = qtys[bill] || 0;
                const subtotal = bill * qty;
                return (
                  <div key={bill} className="grid grid-cols-3 px-3 py-2 items-center">
                    <div className="font-medium">₱{bill}</div>
                    <div>
                      <Input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => setQty(bill, e.target.value)}
                        className="w-24 h-8"
                      />
                    </div>
                    <div className="text-right font-medium">
                      {subtotal > 0 ? formatPHP(subtotal) : "—"}
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-3 px-3 py-3 bg-muted/50 font-semibold">
                <div className="col-span-2">Total</div>
                <div className="text-right text-lg">{formatPHP(total)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="remarks">Remarks (optional)</Label>
            <Input
              id="remarks"
              placeholder="e.g., Building fund, missions..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={total === 0 || submitting}>
              {submitting ? "Submitting…" : "Submit Tithes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
