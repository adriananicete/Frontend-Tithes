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

export function ConfirmCategoryActionDialog({ category, action, open, onOpenChange }) {
  if (!category || !action) return null;

  const config = {
    archive: {
      title: "Archive category?",
      description: `"${category.name}" will be hidden from new entries but existing records remain linked.`,
      confirmLabel: "Archive",
      destructive: false,
      endpoint: `PATCH /api/admin/categories/${category.id} (isActive: false)`,
    },
    restore: {
      title: "Restore category?",
      description: `"${category.name}" will be available for selection again on new entries.`,
      confirmLabel: "Restore",
      destructive: false,
      endpoint: `PATCH /api/admin/categories/${category.id} (isActive: true)`,
    },
    delete: {
      title: "Delete category?",
      description:
        category.usageCount > 0
          ? `"${category.name}" is used in ${category.usageCount} entries. Deleting would break those references — archive instead.`
          : `"${category.name}" will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete permanently",
      destructive: true,
      disabled: category.usageCount > 0,
      endpoint: `DELETE /api/admin/categories/${category.id}`,
    },
  }[action];

  const handleConfirm = () => {
    // TODO: call endpoint
    console.log(`${action} category (mock):`, config.endpoint);
    onOpenChange?.(false);
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

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={config.disabled}
            className={
              config.destructive ? "bg-red-600 hover:bg-red-700 text-white" : ""
            }
          >
            {config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
