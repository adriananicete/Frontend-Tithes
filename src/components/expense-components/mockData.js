// ============================================================
// MOCK DATA for Expense page
// TODO: replace with GET /api/expenses
// ============================================================

export const mockExpenseCategories = [
  "Utilities",
  "Food",
  "Events",
  "Missions",
  "Supplies",
  "Maintenance",
  "Transportation",
];

// Expense source:
//   "voucher" — auto-recorded when Dani creates a PCF voucher
//   "manual"  — admin-entered directly (POST /api/expenses)
export const sourceConfig = {
  voucher: { label: "Voucher", color: "bg-blue-100 text-blue-700" },
  manual:  { label: "Manual",  color: "bg-purple-100 text-purple-700" },
};

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const mockExpenses = [
  // This month (last 30 days)
  { id: 1,  source: "voucher", linkedRef: "PCF-0003", amount: 8500,  category: "Maintenance",    date: daysAgo(2),  recordedBy: "Dani",   remarks: "Plumbing repair" },
  { id: 2,  source: "manual",  linkedRef: null,       amount: 2400,  category: "Supplies",       date: daysAgo(4),  recordedBy: "Adrian", remarks: "Printer ink and paper" },
  { id: 3,  source: "voucher", linkedRef: "PCF-0002", amount: 12000, category: "Events",         date: daysAgo(9),  recordedBy: "Dani",   remarks: "Family day" },
  { id: 4,  source: "manual",  linkedRef: null,       amount: 1800,  category: "Food",           date: daysAgo(12), recordedBy: "Adrian", remarks: "Volunteer snacks" },
  { id: 5,  source: "voucher", linkedRef: "PCF-0001", amount: 18000, category: "Missions",       date: daysAgo(15), recordedBy: "Dani",   remarks: "Bible study materials" },
  { id: 6,  source: "manual",  linkedRef: null,       amount: 3200,  category: "Utilities",      date: daysAgo(20), recordedBy: "Adrian", remarks: "Electric bill top-up" },
  { id: 7,  source: "manual",  linkedRef: null,       amount: 950,   category: "Transportation", date: daysAgo(25), recordedBy: "Adrian", remarks: "Fuel reimbursement" },

  // Last 3 months range (30–90 days)
  { id: 8,  source: "voucher", linkedRef: "PCF-0008", amount: 6500,  category: "Utilities",      date: daysAgo(38), recordedBy: "Dani",   remarks: "Water bill" },
  { id: 9,  source: "voucher", linkedRef: "PCF-0009", amount: 15000, category: "Events",         date: daysAgo(44), recordedBy: "Dani",   remarks: "Anniversary celebration" },
  { id: 10, source: "manual",  linkedRef: null,       amount: 2200,  category: "Supplies",       date: daysAgo(50), recordedBy: "Adrian", remarks: "Cleaning supplies" },
  { id: 11, source: "voucher", linkedRef: "PCF-0010", amount: 9500,  category: "Maintenance",    date: daysAgo(58), recordedBy: "Dani",   remarks: "Aircon servicing" },
  { id: 12, source: "manual",  linkedRef: null,       amount: 1500,  category: "Food",           date: daysAgo(65), recordedBy: "Adrian", remarks: "Prayer meeting snacks" },
  { id: 13, source: "voucher", linkedRef: "PCF-0011", amount: 22000, category: "Missions",       date: daysAgo(72), recordedBy: "Dani",   remarks: "Provincial outreach" },
  { id: 14, source: "manual",  linkedRef: null,       amount: 4100,  category: "Transportation", date: daysAgo(80), recordedBy: "Adrian", remarks: "Van rental" },
  { id: 15, source: "voucher", linkedRef: "PCF-0012", amount: 7800,  category: "Utilities",      date: daysAgo(88), recordedBy: "Dani",   remarks: "Internet + electric" },

  // Earlier this year (90+ days)
  { id: 16, source: "voucher", linkedRef: "PCF-0013", amount: 13500, category: "Events",         date: daysAgo(110), recordedBy: "Dani",   remarks: "Youth camp" },
  { id: 17, source: "manual",  linkedRef: null,       amount: 2800,  category: "Supplies",       date: daysAgo(130), recordedBy: "Adrian", remarks: "Sound cables" },
  { id: 18, source: "voucher", linkedRef: "PCF-0014", amount: 16500, category: "Missions",       date: daysAgo(150), recordedBy: "Dani",   remarks: "Visayas trip" },
  { id: 19, source: "manual",  linkedRef: null,       amount: 5200,  category: "Maintenance",    date: daysAgo(175), recordedBy: "Adrian", remarks: "Roof patching" },
  { id: 20, source: "voucher", linkedRef: "PCF-0015", amount: 4500,  category: "Utilities",      date: daysAgo(200), recordedBy: "Dani",   remarks: "Monthly electric" },
  { id: 21, source: "manual",  linkedRef: null,       amount: 3600,  category: "Food",           date: daysAgo(230), recordedBy: "Adrian", remarks: "Anniversary meal" },
  { id: 22, source: "voucher", linkedRef: "PCF-0016", amount: 11000, category: "Events",         date: daysAgo(260), recordedBy: "Dani",   remarks: "Fellowship night" },
  { id: 23, source: "manual",  linkedRef: null,       amount: 1900,  category: "Transportation", date: daysAgo(290), recordedBy: "Adrian", remarks: "Fuel" },
];

// Linked RF info for voucher-source rows (mirrors voucher-components/mockData shape
// so the DetailsDialog can render a "Linked Voucher" card).
export const mockLinkedVouchers = {
  "PCF-0001": { rfNo: "RF-0014", requestedBy: "Lourdes", approvedBy: "Bernie" },
  "PCF-0002": { rfNo: "RF-0013", requestedBy: "Kiya",    approvedBy: "Bernie" },
  "PCF-0003": { rfNo: "RF-0012", requestedBy: "Berna",   approvedBy: "Bernie" },
  "PCF-0008": { rfNo: "RF-0020", requestedBy: "Lourdes", approvedBy: "Bernie" },
  "PCF-0009": { rfNo: "RF-0021", requestedBy: "Berna",   approvedBy: "Bernie" },
  "PCF-0010": { rfNo: "RF-0022", requestedBy: "Kiya",    approvedBy: "Bernie" },
  "PCF-0011": { rfNo: "RF-0023", requestedBy: "Lourdes", approvedBy: "Bernie" },
  "PCF-0012": { rfNo: "RF-0024", requestedBy: "Berna",   approvedBy: "Bernie" },
  "PCF-0013": { rfNo: "RF-0025", requestedBy: "Kiya",    approvedBy: "Bernie" },
  "PCF-0014": { rfNo: "RF-0026", requestedBy: "Berna",   approvedBy: "Bernie" },
  "PCF-0015": { rfNo: "RF-0027", requestedBy: "Lourdes", approvedBy: "Bernie" },
  "PCF-0016": { rfNo: "RF-0028", requestedBy: "Kiya",    approvedBy: "Bernie" },
};

export const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
