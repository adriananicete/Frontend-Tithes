import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { Plus, Trash2 } from "lucide-react";
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
import { mockCategories } from "./mockData";

const today = () => new Date().toISOString().slice(0, 10);

export function CreateRfDialog() {
  const [open, setOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(today());
  const [category, setCategory] = useState(mockCategories[0]);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attachments, setAttachments] = useState([""]);

  const reset = () => {
    setEntryDate(today());
    setCategory(mockCategories[0]);
    setAmount("");
    setRemarks("");
    setAttachments([""]);
  };

  const updateAttachment = (i, value) => {
    setAttachments((prev) => prev.map((a, idx) => (idx === i ? value : a)));
  };

  const addAttachment = () => setAttachments((prev) => [...prev, ""]);
  const removeAttachment = (i) =>
    setAttachments((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (status) => (e) => {
    e.preventDefault();
    const payload = {
      entryDate,
      category,
      estimatedAmount: Number(amount) || 0,
      remarks,
      attachments: attachments.filter((a) => a.trim()),
      status,
    };
    // TODO: POST /api/request-form (then PATCH /submit if status === "submitted")
    console.log("Create RF (mock):", payload);
    setOpen(false);
    reset();
  };

  return (
    <>
      <div className="w-full sm:w-40" onClick={() => setOpen(true)}>
        <CustomButton titleName="Create Request" icon={GoPlus} />
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
            <DialogTitle>Create Request Form</DialogTitle>
            <DialogDescription>
              Fill out the request details. Save as draft or submit for validation.
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
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Estimated Amount (₱)</Label>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Attachments (URLs)</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addAttachment}>
                  <Plus className="h-3 w-3" /> Add more
                </Button>
              </div>
              <div className="space-y-2">
                {attachments.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => updateAttachment(i, e.target.value)}
                    />
                    {attachments.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSubmit("draft")}
                disabled={!amount}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmit("submitted")}
                disabled={!amount}
              >
                Submit for Validation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
