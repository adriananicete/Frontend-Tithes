// Shared lookups for the Reports page (formatters + date range presets).
// Mock data arrays were stripped on feat/reports-real-data — page now reads
// from /api/reports/* via useReports hook.

export const rangePresets = [
  { key: "this_month",  label: "This Month" },
  { key: "last_month",  label: "Last Month" },
  { key: "last_3_mos",  label: "Last 3 Months" },
  { key: "this_year",   label: "This Year" },
];

// Format as local YYYY-MM-DD (avoid toISOString which shifts by timezone offset —
// e.g., PH time Apr 1 0:00 becomes Mar 31 16:00 UTC → "2026-03-31")
const fmtLocal = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const resolvePreset = (key) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (key === "this_month") {
    return { start: fmtLocal(new Date(y, m, 1)), end: fmtLocal(new Date(y, m + 1, 0)) };
  }
  if (key === "last_month") {
    return { start: fmtLocal(new Date(y, m - 1, 1)), end: fmtLocal(new Date(y, m, 0)) };
  }
  if (key === "last_3_mos") {
    return { start: fmtLocal(new Date(y, m - 3, 1)), end: fmtLocal(new Date(y, m + 1, 0)) };
  }
  if (key === "this_year") {
    return { start: fmtLocal(new Date(y, 0, 1)), end: fmtLocal(new Date(y, 11, 31)) };
  }
  return null;
};

export const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

export const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
