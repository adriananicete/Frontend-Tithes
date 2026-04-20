// Shared lookup constants + formatters for the Request Form feature.
// Mock arrays were removed when the page wired to real backend data;
// the file name is preserved for import compatibility.

export const statusConfig = {
  draft:           { label: "Draft",           color: "bg-gray-100 text-gray-700",       order: 1 },
  submitted:       { label: "Submitted",       color: "bg-blue-100 text-blue-700",       order: 2 },
  for_approval:    { label: "For Approval",    color: "bg-indigo-100 text-indigo-700",   order: 3 },
  approved:        { label: "Approved",        color: "bg-green-100 text-green-700",     order: 4 },
  voucher_created: { label: "Voucher Created", color: "bg-purple-100 text-purple-700",   order: 5 },
  disbursed:       { label: "Disbursed",       color: "bg-emerald-100 text-emerald-700", order: 6 },
  rejected:        { label: "Rejected",        color: "bg-red-100 text-red-700",         order: 99 },
};

export const pipelineStages = [
  "draft",
  "submitted",
  "for_approval",
  "approved",
  "voucher_created",
  "disbursed",
];

export const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
