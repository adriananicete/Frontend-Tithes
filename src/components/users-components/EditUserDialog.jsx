import { useEffect, useState } from "react";
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
import { ROLES } from "./mockData";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EditUserDialog({ user, open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setSubmitting(false);
      setError("");
      setSubmitAttempted(false);
    }
  }, [user]);

  if (!user) return null;

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const nameError = submitAttempted && !trimmedName ? "Name is required" : "";
  const emailError = !trimmedEmail
    ? submitAttempted ? "Email is required" : ""
    : !EMAIL_REGEX.test(trimmedEmail)
    ? "Enter a valid email address"
    : "";
  const roleError = submitAttempted && !role ? "Select a role" : "";

  const isValid =
    !!trimmedName &&
    !!trimmedEmail &&
    EMAIL_REGEX.test(trimmedEmail) &&
    !!role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError("");
    if (!isValid) return;

    setSubmitting(true);
    try {
      await onSubmit?.({ name: trimmedName, email: trimmedEmail, role });
      onOpenChange?.(false);
    } catch (err) {
      setError(err.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user's profile or role. Password changes happen via the user's own settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="editName">Full Name</Label>
            <Input
              id="editName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameError}
              autoComplete="name"
            />
            <FieldHelp error={nameError}>Required</FieldHelp>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="editEmail">Email</Label>
            <Input
              id="editEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              autoComplete="email"
            />
            <FieldHelp error={emailError}>Used to log in</FieldHelp>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger aria-invalid={!!roleError}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldHelp error={roleError}>Required</FieldHelp>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
