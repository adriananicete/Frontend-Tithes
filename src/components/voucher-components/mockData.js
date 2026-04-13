// ============================================================
// MOCK DATA for Voucher page
// TODO: replace with GET /api/vouchers and GET /api/request-form?status=approved
// ============================================================

export const mockCategories = [
  "Events",
  "Missions",
  "Utilities",
  "Supplies",
  "Maintenance",
  "Youth Programs",
];

// Approved RFs that do NOT yet have a voucher — these are the candidates
// for voucher creation (Dani/admin picks one to generate a PCF).
export const mockApprovedRfs = [
  {
    id: 8,
    rfNo: "RF-0008",
    entryDate: "2026-04-09",
    submittedAt: "2026-04-08T10:30:00",
    category: "Events",
    requestedBy: "Lourdes",
    estimatedAmount: 10000,
    remarks: "Annual fellowship",
    approvedBy: "Bernie",
    approvedAt: "2026-04-09T09:00:00",
  },
  {
    id: 9,
    rfNo: "RF-0009",
    entryDate: "2026-04-08",
    submittedAt: "2026-04-07T09:30:00",
    category: "Missions",
    requestedBy: "Berna",
    estimatedAmount: 20000,
    remarks: "Provincial outreach",
    approvedBy: "Bernie",
    approvedAt: "2026-04-08T10:00:00",
  },
  {
    id: 10,
    rfNo: "RF-0010",
    entryDate: "2026-04-07",
    submittedAt: "2026-04-06T10:15:00",
    category: "Utilities",
    requestedBy: "Kiya",
    estimatedAmount: 4500,
    remarks: "Water bill",
    approvedBy: "Bernie",
    approvedAt: "2026-04-07T09:00:00",
  },
  {
    id: 11,
    rfNo: "RF-0011",
    entryDate: "2026-04-06",
    submittedAt: "2026-04-05T10:15:00",
    category: "Supplies",
    requestedBy: "Lourdes",
    estimatedAmount: 6000,
    remarks: "Sound system accessories",
    approvedBy: "Bernie",
    approvedAt: "2026-04-06T09:00:00",
  },
];

// Vouchers already issued. linkedRfStatus: "voucher_created" = pending receipt,
// "disbursed" = member confirmed receipt (fully complete).
export const mockVouchers = [
  {
    id: 1,
    pcfNo: "PCF-0001",
    date: "2026-03-27",
    amount: 18000,
    category: "Missions",
    receipts: ["https://example.com/receipt-0001.pdf"],
    createdBy: "Dani",
    createdAt: "2026-03-27T14:00:00",
    linkedRf: {
      rfNo: "RF-0014",
      requestedBy: "Lourdes",
      entryDate: "2026-03-28",
      remarks: "Bible study materials",
    },
    linkedRfStatus: "disbursed",
    receivedAt: "2026-03-28T11:00:00",
  },
  {
    id: 2,
    pcfNo: "PCF-0002",
    date: "2026-04-01",
    amount: 12000,
    category: "Events",
    receipts: ["https://example.com/receipt-0002a.jpg", "https://example.com/receipt-0002b.jpg"],
    createdBy: "Dani",
    createdAt: "2026-04-01T14:00:00",
    linkedRf: {
      rfNo: "RF-0013",
      requestedBy: "Kiya",
      entryDate: "2026-04-02",
      remarks: "Family day",
    },
    linkedRfStatus: "disbursed",
    receivedAt: "2026-04-02T10:00:00",
  },
  {
    id: 3,
    pcfNo: "PCF-0003",
    date: "2026-04-05",
    amount: 8500,
    category: "Maintenance",
    receipts: ["https://example.com/receipt-0003.pdf"],
    createdBy: "Dani",
    createdAt: "2026-04-05T10:00:00",
    linkedRf: {
      rfNo: "RF-0012",
      requestedBy: "Berna",
      entryDate: "2026-04-05",
      remarks: "Plumbing repair",
    },
    linkedRfStatus: "voucher_created",
  },
];

export const voucherStatusConfig = {
  voucher_created: { label: "Pending Receipt", color: "bg-amber-100 text-amber-700" },
  disbursed:       { label: "Disbursed",       color: "bg-emerald-100 text-emerald-700" },
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
