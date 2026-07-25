import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// The centered content a table/list shows when it has no rows to render:
// a spinner + label while loading, the error in red, otherwise the empty
// message. Standardizes the loading/empty/error treatment across every data
// view so a cold first load always shows an obvious spinner instead of a
// blank table or a misleading "No records found".
export function DataPlaceholder({
  loading = false,
  error = "",
  empty = "No records found.",
  loadingLabel = "Loading…",
  className,
}) {
  if (loading) return <Spinner label={loadingLabel} className={className} />;
  return (
    <span className={cn(error ? "text-red-600" : "text-muted-foreground", className)}>
      {error || empty}
    </span>
  );
}

export default DataPlaceholder;
