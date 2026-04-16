import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { FileText, Trash2, Upload } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, mockApprovedRfs } from "./mockData";

const today = () => new Date().toISOString().slice(0, 10);

export function CreateVoucherDialog({ preselectedRfId, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  const preselectedRfNo = preselectedRfId
    ? mockApprovedRfs.find((r) => r.id === preselectedRfId)?.rfNo ?? ""
    : "";

  const [rfNo, setRfNo] = useState(preselectedRfNo);
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receipts, setReceipts] = useState([]);

  const selectedRf = mockApprovedRfs.find((r) => r.rfNo === rfNo);

  useEffect(() => {
    if (selectedRf) setAmount(selectedRf.estimatedAmount.toString());
  }, [rfNo]);

  useEffect(() => {
    if (open && preselectedRfNo) setRfNo(preselectedRfNo);
  }, [open, preselectedRfNo]);

  const reset = () => {
    setRfNo("");
    setDate(today());
    setAmount("");
    setRemarks("");
    setReceipts([]);
  };

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length) setReceipts((prev) => [...prev, ...picked]);
    e.target.value = "";
  };

  const removeReceipt = (i) =>
    setReceipts((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRf) return;
    const payload = {
      rfId: selectedRf.id,
      date,
      category: selectedRf.category,
      amount: Number(amount) || 0,
      remarks,
      receipts,
    };
    // TODO: multipart POST /api/vouchers — upload receipts to Cloudinary
    console.log("Create Voucher (mock):", payload);
    setOpen(false);
    reset();
  };

  return (
    <>
      {!isControlled && (
        <div className="w-40" onClick={() => setOpen(true)}>
          <CustomButton titleName="Create Voucher" icon={GoPlus} />
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
            <DialogTitle>Create Voucher (PCF)</DialogTitle>
            <DialogDescription>
              Select an approved request form. The next PCF number will be auto-generated on save.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Approved Request Form</Label>
              <Select value={rfNo} onValueChange={setRfNo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an approved RF..." />
                </SelectTrigger>
                <SelectContent>
                  {mockApprovedRfs.map((rf) => (
                    <SelectItem key={rf.rfNo} value={rf.rfNo}>
                      {rf.rfNo} · Submitted {formatDate(rf.submittedAt)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRf && (
              <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requester</span>
                  <span className="font-medium">{selectedRf.requestedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{selectedRf.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remarks</span>
                  <span className="font-medium">{selectedRf.remarks || "—"}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vdate">Voucher Date</Label>
                <Input
                  id="vdate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vamount">Amount (₱)</Label>
                <Input
                  id="vamount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Receipts</Label>
              <label
                htmlFor="receiptFiles"
                className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 cursor-pointer hover:bg-muted/50 transition"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Click to upload receipts</span>
                <span className="text-xs text-muted-foreground">
                  PDF, JPG, PNG — you can select multiple files
                </span>
                <input
                  id="receiptFiles"
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handleFiles}
                />
              </label>
              {receipts.length > 0 && (
                <div className="space-y-1.5">
                  {receipts.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReceipt(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vremarks">Remarks / Notes (optional)</Label>
              <Textarea
                id="vremarks"
                placeholder="Any additional notes about this voucher..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!selectedRf || !amount}>
                Create Voucher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
