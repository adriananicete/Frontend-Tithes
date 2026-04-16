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

const DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

const serviceTypes = [
  "Sunday Service",
  "Prayer Meeting",
  "Youth Service",
  "Special Offering",
];

const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

const today = () => new Date().toISOString().slice(0, 10);

export function SubmitTithesDialog() {
  const [open, setOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(today());
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [remarks, setRemarks] = useState("");
  const [qtys, setQtys] = useState(() =>
    Object.fromEntries(DENOMINATIONS.map((b) => [b, 0]))
  );

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
    setServiceType(serviceTypes[0]);
    setRemarks("");
    setQtys(Object.fromEntries(DENOMINATIONS.map((b) => [b, 0])));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/tithes
    console.log("Submit tithes (mock):", { entryDate, serviceType, remarks, total, qtys });
    setOpen(false);
    reset();
  };

  return (
    <>
      <div className="w-full sm:w-40" onClick={() => setOpen(true)}>
        <CustomButton titleName="Submit New Tithes" icon={GoPlus} />
      </div>

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
                  {serviceTypes.map((s) => (
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={total === 0}>
              Submit Tithes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
