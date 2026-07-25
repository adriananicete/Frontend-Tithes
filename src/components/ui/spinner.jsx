import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

// Shared loading spinner. Wraps lucide's Loader2 with a spin animation and a
// few named sizes so every loading state across the app looks the same.
// Usage: <Spinner /> inline, or <Spinner size="lg" label="Loading your data…" />
// with a caption below it (label is announced to screen readers either way).
const SIZES = {
  xs: "size-3",
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-10",
};

export function Spinner({ size = "md", label, className }) {
  const dim = SIZES[size] ?? SIZES.md;

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex flex-col items-center gap-2", className)}
    >
      <Loader2 className={cn("animate-spin text-muted-foreground", dim)} />
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </span>
  );
}

export default Spinner;
