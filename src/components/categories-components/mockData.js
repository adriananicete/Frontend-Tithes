// ============================================================
// MOCK DATA for Admin Categories page
// TODO: replace with:
//   GET    /api/admin/categories
//   POST   /api/admin/categories
//   PATCH  /api/admin/categories/:id
//   DELETE /api/admin/categories/:id
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

export const mockCategories = [
  { id: 1,  name: "Events",         type: "rf",      color: "#8b5cf6", isActive: true,  createdBy: "Adrian", usageCount: 12, createdAt: "2025-10-15T10:00:00" },
  { id: 2,  name: "Missions",       type: "rf",      color: "#ec4899", isActive: true,  createdBy: "Adrian", usageCount: 8,  createdAt: "2025-10-15T10:00:00" },
  { id: 3,  name: "Youth Programs", type: "rf",      color: "#f97316", isActive: true,  createdBy: "Adrian", usageCount: 5,  createdAt: "2025-10-20T10:00:00" },
  { id: 4,  name: "Discipleship",   type: "rf",      color: "#22c55e", isActive: true,  createdBy: "Adrian", usageCount: 3,  createdAt: "2025-11-01T10:00:00" },
  { id: 5,  name: "Utilities",      type: "expense", color: "#3b82f6", isActive: true,  createdBy: "Adrian", usageCount: 22, createdAt: "2025-10-15T10:00:00" },
  { id: 6,  name: "Food",           type: "expense", color: "#eab308", isActive: true,  createdBy: "Adrian", usageCount: 14, createdAt: "2025-10-15T10:00:00" },
  { id: 7,  name: "Maintenance",    type: "expense", color: "#64748b", isActive: true,  createdBy: "Adrian", usageCount: 11, createdAt: "2025-10-18T10:00:00" },
  { id: 8,  name: "Supplies",       type: "expense", color: "#14b8a6", isActive: true,  createdBy: "Adrian", usageCount: 9,  createdAt: "2025-10-22T10:00:00" },
  { id: 9,  name: "Transportation", type: "expense", color: "#06b6d4", isActive: true,  createdBy: "Adrian", usageCount: 6,  createdAt: "2025-11-05T10:00:00" },
  { id: 10, name: "Legacy Retreat", type: "rf",      color: "#ef4444", isActive: false, createdBy: "Adrian", usageCount: 0,  createdAt: "2025-09-10T10:00:00" },
];

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
