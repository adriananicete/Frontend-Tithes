// Shared lookups + formatters for the Notifications feature.

export const TYPE_STYLE = {
  approval:  { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700" },
  rejection: { dot: "bg-red-500",     chip: "bg-red-50 text-red-700" },
  info:      { dot: "bg-blue-500",    chip: "bg-blue-50 text-blue-700" },
  reminder:  { dot: "bg-amber-500",   chip: "bg-amber-50 text-amber-700" },
};

const fallbackStyle = { dot: "bg-gray-400", chip: "bg-gray-100 text-gray-700" };

export const styleForType = (type) => TYPE_STYLE[type] ?? fallbackStyle;

export const REF_PATH = {
  Tithes:      "/tithes",
  RequestForm: "/request-form",
  Voucher:     "/voucher",
};

export const pathForRef = (refModel, refId) => {
  const base = REF_PATH[refModel] ?? "/dashboard";
  if (!refId || !REF_PATH[refModel]) return base;
  return `${base}?focus=${refId}`;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < MINUTE) return "just now";
  if (ms < HOUR)  return `${Math.floor(ms / MINUTE)}m ago`;
  if (ms < DAY)   return `${Math.floor(ms / HOUR)}h ago`;
  if (ms < WEEK)  return `${Math.floor(ms / DAY)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatAbsoluteTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
