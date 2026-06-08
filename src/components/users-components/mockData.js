// Shared lookup constants + formatters for the Admin Users page.
// User records come from /api/admin/users via the useUsers hook.

// Re-exported from the shared avatar util so existing `import { getInitials }
// from "./mockData"` call sites keep working from one source of truth.
export { getInitials } from "@/lib/avatar";

export const ROLES = [
  { value: "admin",     label: "Admin" },
  { value: "do",        label: "Disbursing Officer" },
  { value: "validator", label: "Validator" },
  { value: "pastor",    label: "Pastor" },
  { value: "auditor",   label: "Auditor" },
  { value: "member",    label: "Member" },
];

export const roleConfig = {
  admin:     { label: "Admin",              color: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400" },
  do:        { label: "Disbursing Officer", color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400" },
  validator: { label: "Validator",          color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400" },
  pastor:    { label: "Pastor",             color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  auditor:   { label: "Auditor",            color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400" },
  member:    { label: "Member",             color: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300" },
};

export const statusConfig = {
  active:   { label: "Active",   color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  inactive: { label: "Inactive", color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
