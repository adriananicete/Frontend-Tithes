// Shared lookups + formatters for the Tithes feature.
// Tithes records come from /api/tithes via the useTithes hook.

export const SERVICE_TYPES = [
  "Sunday Service",
  "Prayer Meeting",
  "Youth Service",
  "Special Offering",
];

export const DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

export const statusStyles = {
  pending:  "bg-amber-100 text-amber-700 hover:bg-amber-100",
  approved: "bg-green-100 text-green-700 hover:bg-green-100",
  rejected: "bg-red-100 text-red-700 hover:bg-red-100",
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
