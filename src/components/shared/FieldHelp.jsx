// Reusable helper text below a form field.
// - Pass `error` for a red validation message (overrides children).
// - Pass `children` as the neutral gray hint shown when no error.
// - Renders nothing if both are empty.

export function FieldHelp({ children, error, className = "" }) {
  if (!children && !error) return null;
  return (
    <p
      className={`text-xs ${error ? "text-red-600" : "text-muted-foreground"} ${className}`}
    >
      {error || children}
    </p>
  );
}
