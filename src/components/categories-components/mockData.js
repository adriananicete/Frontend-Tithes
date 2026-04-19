// ============================================================
// Lookup constants used across the Categories UI.
// Category records are fetched from /api/admin/categories via useCategories().
// ============================================================

export const TYPES = [
  { value: "rf",      label: "Request Form" },
  { value: "expense", label: "Expense" },
];

export const typeConfig = {
  rf:      { label: "Request Form", color: "bg-indigo-100 text-indigo-700" },
  expense: { label: "Expense",      color: "bg-amber-100 text-amber-700" },
};

export const statusConfig = {
  active:   { label: "Active",   color: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inactive", color: "bg-slate-100 text-slate-700" },
};

// Curated Tailwind-friendly color palette for category accents.
export const COLOR_PALETTE = [
  { value: "#3b82f6", name: "Blue" },
  { value: "#8b5cf6", name: "Violet" },
  { value: "#ec4899", name: "Pink" },
  { value: "#ef4444", name: "Red" },
  { value: "#f97316", name: "Orange" },
  { value: "#eab308", name: "Yellow" },
  { value: "#22c55e", name: "Green" },
  { value: "#14b8a6", name: "Teal" },
  { value: "#06b6d4", name: "Cyan" },
  { value: "#64748b", name: "Slate" },
];

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
