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

// Generic confirmation dialog used for deactivate / activate / delete.
// Parent controls `action` ("deactivate" | "activate" | "delete") to shape the copy.
export function ConfirmUserActionDialog({ user, action, open, onOpenChange }) {
  if (!user || !action) return null;

  const config = {
    deactivate: {
      title: "Deactivate user?",
      description: `${user.name} will not be able to sign in until reactivated. Their data is kept.`,
      confirmLabel: "Deactivate",
      variant: "default",
      endpoint: `PATCH /api/admin/users/${user.id}/deactivate`,
    },
    activate: {
      title: "Activate user?",
      description: `${user.name} will regain the ability to sign in.`,
      confirmLabel: "Activate",
      variant: "default",
      endpoint: `PATCH /api/admin/users/${user.id} (isActive: true)`,
    },
    delete: {
      title: "Delete user?",
      description: `${user.name} will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete permanently",
      variant: "destructive",
      endpoint: `DELETE /api/admin/users/${user.id}`,
    },
  }[action];

  const handleConfirm = () => {
    // TODO: call endpoint
    console.log(`${action} user (mock):`, config.endpoint);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {action === "delete" && <AlertTriangle className="h-5 w-5 text-red-600" />}
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
            variant={config.variant}
            onClick={handleConfirm}
            className={action === "delete" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            {config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
