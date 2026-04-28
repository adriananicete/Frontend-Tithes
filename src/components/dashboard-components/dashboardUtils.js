// Shared helpers for the Dashboard's real-data wiring.
// - buildActivity: aggregates tithes/RFs/vouchers into one sortable feed
// - shared formatters used across SummaryStats, RecentActivity, charts

export const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatActivityAmount = (n) =>
  !n
    ? "—"
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(n);

export const formatActivityDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTithesEntry = (d) => {
  if (!d) return "Tithes";
  return `Tithes ${new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
};

// Each record contributes ONE activity entry reflecting its current state.
// Backend has no audit log, so we synthesize "what just happened" from the
// most-recent transition recorded on each document.
export const buildActivity = ({ tithes = [], rfs = [], vouchers = [] }) => {
  const items = [];

  for (const t of tithes) {
    const ref = formatTithesEntry(t.entryDate);
    if (t.status === "pending") {
      items.push({
        id: `t-${t._id}`,
        user: t.submittedBy?.name ?? "—",
        role: t.submittedBy?.role ?? "member",
        action: "Submitted",
        type: "Tithes",
        ref,
        amount: t.total ?? 0,
        date: t.createdAt ?? t.entryDate,
      });
    } else if (t.status === "approved" || t.status === "rejected") {
      items.push({
        id: `t-${t._id}`,
        user: t.reviewedBy?.name ?? t.submittedBy?.name ?? "—",
        role: t.reviewedBy?.role ?? "—",
        action: t.status === "approved" ? "Approved" : "Rejected",
        type: "Tithes",
        ref,
        amount: t.total ?? 0,
        date: t.reviewedAt ?? t.updatedAt ?? t.createdAt,
      });
    }
  }

  for (const rf of rfs) {
    if (rf.status === "draft") continue;
    const base = {
      id: `rf-${rf._id}`,
      type: "Request Form",
      ref: rf.rfNo ?? "—",
      amount: rf.estimatedAmount ?? 0,
    };

    if (rf.status === "submitted") {
      items.push({
        ...base,
        user: rf.requestedBy?.name ?? "—",
        role: rf.requestedBy?.role ?? "member",
        action: "Submitted",
        date: rf.updatedAt ?? rf.createdAt,
      });
    } else if (rf.status === "for_approval") {
      items.push({
        ...base,
        user: rf.validatedBy?.name ?? "—",
        role: rf.validatedBy?.role ?? "validator",
        action: "Validated",
        date: rf.validatedAt ?? rf.updatedAt,
      });
    } else if (rf.status === "approved" || rf.status === "voucher_created") {
      items.push({
        ...base,
        user: rf.approvedBy?.name ?? "—",
        role: rf.approvedBy?.role ?? "pastor",
        action: "Approved",
        date: rf.approvedAt ?? rf.updatedAt,
      });
    } else if (rf.status === "rejected") {
      items.push({
        ...base,
        user: rf.rejectedBy?.name ?? "—",
        role: rf.rejectedBy?.role ?? "—",
        action: "Rejected",
        date: rf.rejectedAt ?? rf.updatedAt,
      });
    } else if (rf.status === "disbursed") {
      items.push({
        ...base,
        user: rf.disbursedBy?.name ?? "—",
        role: rf.disbursedBy?.role ?? "do",
        action: "Disbursed",
        date: rf.disbursedAt ?? rf.updatedAt,
      });
    } else if (rf.status === "received") {
      items.push({
        ...base,
        user: rf.receivedBy?.name ?? rf.requestedBy?.name ?? "—",
        role: rf.receivedBy?.role ?? rf.requestedBy?.role ?? "member",
        action: "Received",
        date: rf.receivedAt ?? rf.updatedAt,
      });
    }
  }

  for (const v of vouchers) {
    items.push({
      id: `v-${v._id}`,
      user: v.createdBy?.name ?? "—",
      role: v.createdBy?.role ?? "validator",
      action: "Created",
      type: "Voucher",
      ref: v.pcfNo ?? "—",
      amount: v.amount ?? 0,
      date: v.createdAt,
    });
  }

  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  return items;
};

const daysBetween = (d) =>
  (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);

// Sum a list of records by amount field within a day-window from today.
export const sumWithinDays = (records, days, amountField = "amount") => {
  let sum = 0;
  for (const r of records) {
    const date = r.date ?? r.entryDate ?? r.createdAt;
    if (!date) continue;
    const age = daysBetween(date);
    if (age >= 0 && age <= days) sum += Number(r[amountField]) || 0;
  }
  return sum;
};

// Sum within a windowed range [startDays, endDays] back from today.
export const sumWithinRange = (
  records,
  startDays,
  endDays,
  amountField = "amount"
) => {
  let sum = 0;
  for (const r of records) {
    const date = r.date ?? r.entryDate ?? r.createdAt;
    if (!date) continue;
    const age = daysBetween(date);
    if (age >= startDays && age <= endDays) sum += Number(r[amountField]) || 0;
  }
  return sum;
};

// Compute month-over-month percent change. Guards divide-by-zero.
export const monthOverMonthTrend = (current, prior) => {
  if (prior > 0) return Math.round(((current - prior) / prior) * 100);
  if (current > 0) return 100;
  return 0;
};
