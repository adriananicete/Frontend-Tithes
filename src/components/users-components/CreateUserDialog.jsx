import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

const MIN_PASSWORD = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateUserDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRole("");
    setSubmitting(false);
    setError("");
    setSubmitAttempted(false);
  };

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const nameError =
    submitAttempted && !trimmedName ? "Name is required" : "";

  const emailError = !trimmedEmail
    ? submitAttempted ? "Email is required" : ""
    : !EMAIL_REGEX.test(trimmedEmail)
    ? "Enter a valid email address"
    : "";

  const passwordError = !password
    ? submitAttempted ? "Password is required" : ""
    : password.length < MIN_PASSWORD
    ? `Password must be at least ${MIN_PASSWORD} characters (${password.length}/${MIN_PASSWORD})`
    : "";

  const roleError = submitAttempted && !role ? "Select a role" : "";

  const isValid =
    !!trimmedName &&
    !!trimmedEmail &&
    EMAIL_REGEX.test(trimmedEmail) &&
    password.length >= MIN_PASSWORD &&
    !!role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError("");
    if (!isValid) return;

    setSubmitting(true);
    try {
      await onSubmit?.({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role,
      });
      reset();
      onOpenChange?.(false);
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange?.(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Add a new user account. They will receive their credentials from you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g., Juan Dela Cruz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameError}
              autoComplete="name"
            />
            <FieldHelp error={nameError}>Required</FieldHelp>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@joscm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              autoComplete="email"
            />
            <FieldHelp error={emailError}>Used to log in</FieldHelp>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Temporary Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={`At least ${MIN_PASSWORD} characters`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldHelp error={passwordError}>
              At least {MIN_PASSWORD} characters. User can change it later.
            </FieldHelp>
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
              {submitting ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
