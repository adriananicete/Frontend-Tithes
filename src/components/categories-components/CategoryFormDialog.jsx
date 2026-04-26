import { useEffect, useState } from "react";
import { Check } from "lucide-react";
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
import { FieldHelp } from "@/components/shared/FieldHelp";
import { COLOR_PALETTE, TYPES } from "./mockData";

// Combined create + edit dialog. `category` prop present = edit mode.
export function CategoryFormDialog({ category, open, onOpenChange, onSubmit }) {
  const isEdit = !!category;
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setColor(category.color);
    } else if (open) {
      setName("");
      setType("");
      setColor(COLOR_PALETTE[0].value);
    }
    if (open) {
      setError("");
      setSubmitAttempted(false);
    }
  }, [category, open]);

  const trimmedName = name.trim();

  const nameError = submitAttempted && !trimmedName ? "Name is required" : "";
  const typeError = submitAttempted && !type ? "Select a type" : "";

  const isValid = !!trimmedName && !!type && !!color;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError("");
    if (!isValid) return;
    if (!onSubmit) {
      onOpenChange?.(false);
      return;
    }
    const payload = { name: trimmedName, type, color };
    setSubmitting(true);
    try {
      await onSubmit(payload);
      onOpenChange?.(false);
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category name, type, or accent color."
              : "Add a new category for request forms or expenses."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="catName">Name</Label>
            <Input
              id="catName"
              placeholder="e.g., Youth Camp, Office Supplies"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameError}
            />
            <FieldHelp error={nameError}>Required</FieldHelp>
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType} disabled={isEdit}>
              <SelectTrigger aria-invalid={!!typeError}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldHelp error={typeError}>
              {isEdit ? "Type cannot be changed after creation." : "Required"}
            </FieldHelp>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition ${
                    color === c.value ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                  {color === c.value && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1.5">Preview</div>
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{name || "Category name"}</span>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? isEdit ? "Saving…" : "Creating…"
                : isEdit ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
