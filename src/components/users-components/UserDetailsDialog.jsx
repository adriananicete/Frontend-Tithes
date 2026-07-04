import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { AVATAR_ACCEPT, validateAvatarFile } from "@/lib/avatar";
import { formatDate, roleConfig, statusConfig } from "./mockData";

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
  onSetAvatar,
  onRemoveAvatar,
}) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const rcfg = roleConfig[user.role];
  const scfg = user.isActive ? statusConfig.active : statusConfig.inactive;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const msg = validateAvatarFile(file);
    if (msg) return setError(msg);
    setError("");
    setBusy(true);
    try {
      await onSetAvatar?.(user._id, file);
    } catch (err) {
      setError(err.message || "Failed to upload photo");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    setBusy(true);
    try {
      await onRemoveAvatar?.(user._id);
    } catch (err) {
      setError(err.message || "Failed to remove photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} src={user.avatarUrl} userId={user._id} size="lg" />
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

          {(onSetAvatar || onRemoveAvatar) && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Profile photo</div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept={AVATAR_ACCEPT}
                  className="hidden"
                  onChange={handleFile}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                >
                  <Camera className="h-4 w-4" />
                  {user.avatarUrl ? "Change photo" : "Upload photo"}
                </Button>
                {user.avatarUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleRemove}
                    disabled={busy}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                )}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}

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
