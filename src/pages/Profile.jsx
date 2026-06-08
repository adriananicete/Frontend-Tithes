import { useRef, useState } from "react";
import { Camera, KeyRound, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ChangePasswordDialog } from "@/components/sideBar-components/ChangePasswordDialog";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import { notifyAction } from "@/lib/toast";
import { roleConfig } from "@/components/users-components/mockData";
import { AVATAR_ACCEPT, validateAvatarFile } from "@/lib/avatar";

function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pwdOpen, setPwdOpen] = useState(false);

  const rcfg = roleConfig[user?.role] ?? { label: user?.role, color: "" };

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    const msg = validateAvatarFile(file);
    if (msg) {
      setError(msg);
      return;
    }

    setError("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await apiFetch("/users/me/avatar", { method: "PATCH", body: fd });
      updateUser({ avatarUrl: res?.data?.avatarUrl });
      notifyAction("avatarUpdated");
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
      await apiFetch("/users/me/avatar", { method: "DELETE" });
      updateUser({ avatarUrl: null });
      notifyAction("avatarRemoved");
    } catch (err) {
      setError(err.message || "Failed to remove photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile photo and account settings.
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-6">
          <UserAvatar name={user?.name} src={user?.avatarUrl} size="xl" />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept={AVATAR_ACCEPT}
                className="hidden"
                onChange={handleFile}
              />
              <Button type="button" onClick={handlePick} disabled={busy}>
                <Camera className="h-4 w-4" />
                {user?.avatarUrl ? "Change photo" : "Upload photo"}
              </Button>
              {user?.avatarUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemove}
                  disabled={busy}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WEBP. Up to 5MB. Square photos look best.
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Name</div>
              <div className="font-medium">{user?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-medium break-words">{user?.email ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Role</div>
              <div>
                <Badge variant="secondary" className={rcfg.color}>
                  {rcfg.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="button" variant="outline" onClick={() => setPwdOpen(true)}>
              <KeyRound className="h-4 w-4" /> Change password
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
    </div>
  );
}

export default Profile;
