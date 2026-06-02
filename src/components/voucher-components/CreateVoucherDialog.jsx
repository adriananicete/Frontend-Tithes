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
import { apiFetch } from "@/services/api";
import { useCategories } from "@/hooks/useCategories";
import { formatDate } from "./mockData";

const today = () => new Date().toISOString().slice(0, 10);

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";

export function CreateVoucherDialog({
  preselectedRfId,
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

  const [approvedRfs, setApprovedRfs] = useState([]);
  const [rfsLoading, setRfsLoading] = useState(false);
  const [rfsError, setRfsError] = useState("");

  const [rfId, setRfId] = useState("");
  const [date, setDate] = useState(today());
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { categories } = useCategories();
  const rfCategories = categories.filter(
    (c) => c.type === "rf" && c.isActive !== false,
  );

  const selectedRf = approvedRfs.find((r) => r._id === rfId);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setRfsLoading(true);
      setRfsError("");
      try {
        const res = await apiFetch("/request-form?status=approved");
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setApprovedRfs(list.filter((rf) => !rf.voucherId));
      } catch (err) {
        if (cancelled) return;
        setApprovedRfs([]);
        setRfsError(err.message || "Failed to load approved RFs");
      } finally {
        if (!cancelled) setRfsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (open && preselectedRfId) setRfId(preselectedRfId);
  }, [open, preselectedRfId]);

  useEffect(() => {
    if (selectedRf) {
      setAmount(selectedRf.estimatedAmount?.toString() ?? "");
      // Default to the RF's approved category; the validator can change it
      // here to correct a wrong category before the PCF is issued.
      const rfCatId =
        typeof selectedRf.category === "object"
          ? selectedRf.category?._id
          : selectedRf.category;
      setCategoryId(rfCatId ?? "");
    }
  }, [rfId]);

  const reset = () => {
    setRfId("");
    setDate(today());
    setCategoryId("");
    setAmount("");
    setRemarks("");
    setReceipts([]);
    setError("");
  };

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    const valid = [];
    let sizeErr = "";
    for (const file of picked) {
      if (file.size > MAX_SIZE_BYTES) {
        sizeErr = `${file.name} exceeds 10MB`;
        continue;
      }
      valid.push(file);
    }
    setReceipts((prev) => {
      const merged = [...prev, ...valid].slice(0, MAX_FILES);
      if (prev.length + valid.length > MAX_FILES)
        setError(`Only ${MAX_FILES} files allowed — extras were ignored`);
      else if (sizeErr) setError(sizeErr);
      else setError("");
      return merged;
    });
    e.target.value = "";
  };

  const removeReceipt = (i) =>
    setReceipts((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRf || !onSubmit) return;
    const formData = new FormData();
    formData.append("rfId", selectedRf._id);
    formData.append("category", categoryId);
    formData.append("amount", String(Number(amount) || 0));
    if (remarks.trim()) formData.append("remarks", remarks.trim());
    receipts.forEach((file) => formData.append("receipts", file));

    setSubmitting(true);
    setError("");
    try {
      await onSubmit(formData);
      setOpen(false);
      reset();
    } catch (err) {
      setError(err.message || "Failed to create voucher");
    } finally {
      setSubmitting(false);
    }
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
              <Select value={rfId} onValueChange={setRfId} disabled={rfsLoading}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      rfsLoading
                        ? "Loading approved RFs…"
                        : approvedRfs.length === 0
                        ? "No approved RFs available"
                        : "Select an approved RF..."
                    }
                  >
                    {(value) => {
                      const rf = approvedRfs.find((r) => r._id === value);
                      if (rf) {
                        return `${rf.rfNo} · Approved ${formatDate(
                          rf.approvedAt ?? rf.createdAt
                        )}`;
                      }
                      return rfsLoading
                        ? "Loading approved RFs…"
                        : approvedRfs.length === 0
                        ? "No approved RFs available"
                        : "Select an approved RF...";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {approvedRfs.map((rf) => (
                    <SelectItem key={rf._id} value={rf._id}>
                      {rf.rfNo} · Approved {formatDate(rf.approvedAt ?? rf.createdAt)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rfsError && (
                <p className="text-xs text-red-600">{rfsError}</p>
              )}
            </div>

            {selectedRf && (
              <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requester</span>
                  <span className="font-medium">
                    {selectedRf.requestedBy?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">
                    {selectedRf.category?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remarks</span>
                  <span className="font-medium">{selectedRf.remarks || "—"}</span>
                </div>
              </div>
            )}

            {selectedRf && (
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        rfCategories.length ? "Select category" : "No categories"
                      }
                    >
                      {(value) =>
                        rfCategories.find((c) => c._id === value)?.name ||
                        (rfCategories.length ? "Select category" : "No categories")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {rfCategories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Defaults to the approved category — change it here to correct a wrong category before issuing the PCF.
                </p>
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
              <Label>
                Receipts <span className="text-red-600">*</span>
              </Label>
              <label
                htmlFor="receiptFiles"
                className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 cursor-pointer hover:bg-muted/50 transition"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Click to upload receipts</span>
                <span className="text-xs text-muted-foreground">
                  Required — JPG, PNG, WebP — 1 to 5 files, 10MB each
                </span>
                <input
                  id="receiptFiles"
                  type="file"
                  multiple
                  accept={ACCEPT}
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
                        disabled={submitting}
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

            {error && <p className="text-xs text-red-600">{error}</p>}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  !selectedRf || !categoryId || !amount || receipts.length === 0 || submitting
                }
              >
                {submitting ? "Creating…" : "Create Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
