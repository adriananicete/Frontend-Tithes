// Shared lookups + formatters for the Tithes feature.
// Tithes records come from /api/tithes via the useTithes hook.

// These are the only values the API accepts (TithesEntry.serviceType enum).
// The list had drifted: "Prayer Meeting", "Youth Service" and "Special Offering"
// were offered in the submit dialog and rejected by the server every time, so
// three of the four options in the dropdown could not be submitted at all.
export const SERVICE_TYPES = [
  "Sunday Service",
  "Special Service",
  "Anniversary Service",
];

export const DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

export const statusStyles = {
  pending:  "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/15",
  approved: "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/15 dark:text-green-400 dark:hover:bg-green-500/15",
  rejected: "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/15",
};

export const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatShortDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
