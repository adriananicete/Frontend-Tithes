// Shared lookup constants + formatters for the Expense feature.
// Real expense data is fetched via useExpenses() — see src/hooks/useExpenses.js.

// Expense source:
//   "voucher" — auto-recorded when Dani creates a PCF voucher
//   "manual"  — admin-entered directly (POST /api/expenses)
export const sourceConfig = {
  voucher: { label: "Voucher", color: "bg-blue-100 text-blue-700" },
  manual:  { label: "Manual",  color: "bg-purple-100 text-purple-700" },
};

export const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
