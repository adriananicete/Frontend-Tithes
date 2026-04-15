// ============================================================
// MOCK DATA for Admin Users page
// TODO: replace with:
//   GET    /api/admin/users
//   POST   /api/admin/users
//   PATCH  /api/admin/users/:id
//   PATCH  /api/admin/users/:id/deactivate
//   DELETE /api/admin/users/:id
// ============================================================

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

export const mockUsers = [
  { id: 1, name: "Adrian Anicete",  email: "adrian@joscm.org",  role: "admin",     isActive: true,  createdAt: "2025-10-12T10:00:00", lastLogin: "2026-04-15T08:30:00" },
  { id: 2, name: "Bernie Santos",   email: "bernie@joscm.org",  role: "pastor",    isActive: true,  createdAt: "2025-10-15T10:00:00", lastLogin: "2026-04-14T19:00:00" },
  { id: 3, name: "Dani Reyes",      email: "dani@joscm.org",    role: "validator", isActive: true,  createdAt: "2025-10-18T10:00:00", lastLogin: "2026-04-15T09:12:00" },
  { id: 4, name: "Jaymar Cruz",     email: "jaymar@joscm.org",  role: "do",        isActive: true,  createdAt: "2025-10-20T10:00:00", lastLogin: "2026-04-14T14:00:00" },
  { id: 5, name: "Roselyn Dela Cruz", email: "roselyn@joscm.org", role: "auditor", isActive: true, createdAt: "2025-10-22T10:00:00", lastLogin: "2026-04-13T16:45:00" },
  { id: 6, name: "Berna Tan",       email: "berna@joscm.org",   role: "member",    isActive: true,  createdAt: "2025-11-02T10:00:00", lastLogin: "2026-04-13T11:20:00" },
  { id: 7, name: "Lourdes Garcia",  email: "lourdes@joscm.org", role: "member",    isActive: true,  createdAt: "2025-11-05T10:00:00", lastLogin: "2026-04-12T20:00:00" },
  { id: 8, name: "Kiya Ramos",      email: "kiya@joscm.org",    role: "member",    isActive: true,  createdAt: "2025-11-10T10:00:00", lastLogin: "2026-04-15T07:50:00" },
  { id: 9, name: "Marco Villanueva", email: "marco@joscm.org",  role: "member",    isActive: false, createdAt: "2025-11-18T10:00:00", lastLogin: "2026-02-20T09:00:00" },
  { id: 10, name: "Tess Mercado",   email: "tess@joscm.org",    role: "auditor",   isActive: false, createdAt: "2025-12-01T10:00:00", lastLogin: "2026-03-10T10:00:00" },
];

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
