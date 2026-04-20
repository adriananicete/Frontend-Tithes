// Shared lookup constants + formatters for the Admin Users page.
// User records come from /api/admin/users via the useUsers hook.

export const ROLES = [
  { value: "admin",     label: "Admin" },
  { value: "do",        label: "Disbursing Officer" },
  { value: "validator", label: "Validator" },
  { value: "pastor",    label: "Pastor" },
  { value: "auditor",   label: "Auditor" },
  { value: "member",    label: "Member" },
];

export const roleConfig = {
  admin:     { label: "Admin",              color: "bg-purple-100 text-purple-700" },
  do:        { label: "Disbursing Officer", color: "bg-orange-100 text-orange-700" },
  validator: { label: "Validator",          color: "bg-indigo-100 text-indigo-700" },
  pastor:    { label: "Pastor",             color: "bg-amber-100 text-amber-700" },
  auditor:   { label: "Auditor",            color: "bg-sky-100 text-sky-700" },
  member:    { label: "Member",             color: "bg-slate-100 text-slate-700" },
};

export const statusConfig = {
  active:   { label: "Active",   color: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inactive", color: "bg-red-100 text-red-700" },
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

export const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
