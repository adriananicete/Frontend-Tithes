import { formatPHP } from "@/components/dashboard-components/dashboardUtils";

const TYPE_BADGE = {
  rf: {
    label: "RF",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  voucher: {
    label: "PCF",
    cls: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  },
};

// One clickable search result row — shared by the header dropdown and the
// full /search results page so the look stays identical.
export function SearchResultRow({ result, onSelect }) {
  const badge = TYPE_BADGE[result.type] ?? {
    label: "?",
    cls: "bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground",
  };
  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-accent flex items-center gap-3"
    >
      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
        {badge.label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{result.ref}</p>
        {result.sub && (
          <p className="text-xs text-muted-foreground truncate">{result.sub}</p>
        )}
      </div>
      <span className="text-xs font-medium tabular-nums shrink-0">
        {formatPHP(result.amount)}
      </span>
    </button>
  );
}

// Header search dropdown — mirrors the NotificationsBell popover styling.
export function SearchResultsDropdown({
  results = [],
  counts = { rf: 0, voucher: 0 },
  loading = false,
  error = "",
  query = "",
  onSelect,
  onViewAll,
}) {
  const total = (counts.rf || 0) + (counts.voucher || 0);

  return (
    <div className="absolute right-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
      <div className="max-h-80 overflow-auto divide-y">
        {loading ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Searching…</p>
        ) : error ? (
          <p className="px-4 py-6 text-center text-sm text-red-600">{error}</p>
        ) : results.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No results for “{query.trim()}”
          </p>
        ) : (
          results.map((r) => (
            <SearchResultRow key={`${r.type}-${r.id}`} result={r} onSelect={onSelect} />
          ))
        )}
      </div>

      {results.length > 0 && (
        <div className="border-t p-1">
          <button
            type="button"
            onClick={onViewAll}
            className="w-full rounded-sm px-3 py-2 text-sm font-medium text-center hover:bg-gray-50 dark:hover:bg-accent"
          >
            View all results ({total})
          </button>
        </div>
      )}
    </div>
  );
}
