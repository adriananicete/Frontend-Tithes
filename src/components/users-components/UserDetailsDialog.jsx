import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, getInitials, roleConfig, statusConfig } from "./mockData";

export function UserDetailsDialog({ user, open, onOpenChange }) {
  if (!user) return null;

  const rcfg = roleConfig[user.role];
  const scfg = user.isActive ? statusConfig.active : statusConfig.inactive;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
              {getInitials(user.name)}
            </div>
            <div className="space-y-1">
              <DialogTitle>{user.name}</DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={rcfg.color}>
              {rcfg.label}
            </Badge>
            <Badge variant="secondary" className={scfg.color}>
              {scfg.label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Account Created</div>
              <div className="font-medium">{formatDate(user.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="font-medium">
                {user.updatedAt ? formatDate(user.updatedAt) : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Role</div>
              <div className="font-medium">{rcfg.label}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-medium">{scfg.label}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
