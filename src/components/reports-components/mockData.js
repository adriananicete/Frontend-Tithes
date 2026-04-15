// ============================================================
// MOCK DATA for Reports page
// TODO: replace with:
//   GET /api/reports/tithes?startDate=...&endDate=...
//   GET /api/reports/expense?startDate=...&endDate=...
// Exports:
//   GET /api/reports/tithes/export/excel?startDate=...&endDate=...
//   GET /api/reports/tithes/export/pdf?startDate=...&endDate=...
//   GET /api/reports/expense/export/excel?startDate=...&endDate=...
//   GET /api/reports/expense/export/pdf?startDate=...&endDate=...
// ============================================================

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const seedTithes = () => {
  const serviceTypes = ["Sunday Service", "Prayer Meeting", "Youth Service", "Special Offering"];
  const submitters = ["Berna", "Lourdes", "Kiya"];
  return Array.from({ length: 60 }).map((_, i) => ({
    id: i + 1,
    entryDate: daysAgo(Math.floor(Math.random() * 340)),
    serviceType: serviceTypes[i % serviceTypes.length],
    total: Math.round(500 + Math.random() * 8500),
    submittedBy: submitters[i % submitters.length],
    status: i % 11 === 0 ? "rejected" : i % 7 === 0 ? "pending" : "approved",
  }));
};

const seedExpenses = () => {
  const cats = ["Utilities", "Food", "Events", "Missions", "Supplies", "Maintenance", "Transportation"];
  const recorders = ["Adrian", "Dani"];
  return Array.from({ length: 55 }).map((_, i) => ({
    id: i + 1,
    date: daysAgo(Math.floor(Math.random() * 340)),
    source: i % 3 === 0 ? "manual" : "voucher",
    category: cats[i % cats.length],
    amount: Math.round(500 + Math.random() * 18000),
    recordedBy: recorders[i % recorders.length],
    linkedRef: i % 3 === 0 ? null : `PCF-${String(i + 1).padStart(4, "0")}`,
  }));
};

export const mockTithesData = seedTithes();
export const mockExpenseData = seedExpenses();

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
  }).format(n);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Filter a dataset by date range (inclusive). dateKey = field name of the date column.
export const filterByRange = (data, dateKey, startDate, endDate) => {
  if (!startDate || !endDate) return data;
  const s = new Date(startDate).getTime();
  const e = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1;
  return data.filter((row) => {
    const t = new Date(row[dateKey]).getTime();
    return t >= s && t <= e;
  });
};
