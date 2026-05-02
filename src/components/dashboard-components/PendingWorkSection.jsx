import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BadgeCheck,
  CheckCheck,
  CircleDot,
  ClipboardCheck,
  FileCheck2,
  Inbox,
  Loader2,
  PackageCheck,
  Pencil,
  Receipt,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP } from "@/components/dashboard-components/dashboardUtils";
import { can } from "@/utils/rolePermissions";

const personName = (val) =>
  val && typeof val === "object" ? val.name : typeof val === "string" ? val : "—";

const ownerId = (rf) =>
  typeof rf?.requestedBy === "string" ? null : rf?.requestedBy?._id ?? null;

const submitterId = (t) =>
  typeof t?.submittedBy === "string" ? null : t?.submittedBy?._id ?? null;

const formatShortDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

// One section = one bucket of pending work for the active role. Each section
// has its own icon + title + clickable rows that deep-link to the source page
// using the same ?focus= pattern that NotificationsBell uses.
function PendingSection({ icon: Icon, title, hint, items, renderRow, emptyText, accent }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-3 ${accent ?? ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">{title}</p>
          <Badge variant="secondary" className="ml-1">
            {items.length}
          </Badge>
        </div>
        {hint && (
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">{emptyText}</p>
        ) : (
          items.map(renderRow)
        )}
      </div>
    </div>
  );
}

export function PendingWorkSection({
  role,
  userId,
  tithes = [],
  rfs = [],
  vouchers = [],
  actions = {},
}) {
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [errorById, setErrorById] = useState({});

  // Quick-action runner. Tracks the active row + per-row error so other
  // rows stay clickable while one is in flight, and a failure surfaces
  // inline (red text) under the row that failed instead of a global alert.
  const runAction = async (id, fn) => {
    setBusyId(id);
    setErrorById((e) => ({ ...e, [id]: "" }));
    try {
      await fn();
    } catch (err) {
      setErrorById((e) => ({ ...e, [id]: err?.message || "Action failed" }));
    } finally {
      setBusyId(null);
    }
  };

  // One row → one action label + handler, derived from bucket key + role.
  // Returns null when the role/owner can't act on this row (e.g. admin
  // viewing the member-only "Confirm Receipt" bucket — still visible for
  // monitoring, just no button).
  const actionForRow = (bucketKey, item) => {
    const itemId = item._id;
    switch (bucketKey) {
      case "tithes":
        return { label: "Approve", run: () => actions.approveTithes?.(itemId) };
      case "rf-submitted":
        return can.validateRf(role)
          ? { label: "Validate", run: () => actions.validateRf?.(itemId) }
          : null;
      case "rf-for_approval":
        return can.approveRf(role)
          ? { label: "Approve", run: () => actions.approveRf?.(itemId) }
          : null;
      case "rf-approved":
        return can.createVoucherFromRf(role)
          ? { label: "Create Voucher", run: () => actions.onCreateVoucher?.(item) }
          : null;
      case "rf-voucher_created":
        return can.disburseRf(role)
          ? { label: "Disburse", run: () => actions.disburseRf?.(itemId) }
          : null;
      case "rf-disbursed": {
        const isOwner = ownerId(item) && userId && ownerId(item) === userId;
        return isOwner
          ? { label: "Mark as Received", run: () => actions.markRfReceived?.(itemId) }
          : null;
      }
      case "rf-draft":
        return { label: "Submit", run: () => actions.submitRf?.(itemId) };
      default:
        return null;
    }
  };

  const buckets = useMemo(() => {
    if (!role) return null;

    const pendingTithes = tithes.filter((t) => t.status === "pending");
    const pendingTithesNotOwn = pendingTithes.filter(
      (t) => submitterId(t) !== userId,
    );

    const rfByStatus = (status) => rfs.filter((r) => r.status === status);
    const rfBySetStatus = (statuses) =>
      rfs.filter((r) => statuses.includes(r.status));

    if (role === "admin") {
      return [
        { key: "tithes", title: "Pending tithes", icon: ClipboardCheck, items: pendingTithesNotOwn, kind: "tithes" },
        { key: "rf-submitted", title: "RFs to validate", icon: FileCheck2, items: rfByStatus("submitted"), kind: "rf" },
        { key: "rf-for_approval", title: "RFs to approve", icon: CheckCheck, items: rfByStatus("for_approval"), kind: "rf" },
        { key: "rf-approved", title: "RFs awaiting voucher", icon: Receipt, items: rfByStatus("approved"), kind: "rf" },
        { key: "rf-voucher_created", title: "RFs awaiting disbursement", icon: BadgeCheck, items: rfByStatus("voucher_created"), kind: "rf" },
        { key: "rf-disbursed", title: "RFs awaiting receipt", icon: PackageCheck, items: rfByStatus("disbursed"), kind: "rf" },
      ];
    }

    if (role === "do") {
      return [
        { key: "tithes", title: "Tithes to review", icon: ClipboardCheck, items: pendingTithesNotOwn, kind: "tithes" },
        { key: "rf-voucher_created", title: "RFs to mark disbursed", icon: BadgeCheck, items: rfByStatus("voucher_created"), kind: "rf" },
      ];
    }

    if (role === "validator") {
      return [
        { key: "rf-submitted", title: "RFs to validate", icon: FileCheck2, items: rfByStatus("submitted"), kind: "rf" },
        { key: "rf-approved", title: "RFs awaiting voucher", icon: Receipt, items: rfByStatus("approved"), kind: "rf" },
      ];
    }

    if (role === "pastor") {
      return [
        { key: "rf-for_approval", title: "RFs to approve", icon: CheckCheck, items: rfByStatus("for_approval"), kind: "rf" },
      ];
    }

    if (role === "member") {
      const ownDrafts = rfs.filter(
        (r) => r.status === "draft" && ownerId(r) === userId,
      );
      const ownDisbursed = rfs.filter(
        (r) => r.status === "disbursed" && ownerId(r) === userId,
      );
      return [
        { key: "rf-disbursed", title: "Confirm receipt", icon: PackageCheck, items: ownDisbursed, kind: "rf" },
        { key: "rf-draft", title: "Drafts to submit", icon: Pencil, items: ownDrafts, kind: "rf" },
      ];
    }

    if (role === "auditor") {
      // Auditor's pending view is read-only oversight: counts across the
      // pipeline. No row-level actions, no clickable items.
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const vouchersThisMonth = vouchers.filter((v) => {
        const d = v.createdAt ?? v.date;
        return d && new Date(d) >= startOfMonth;
      });
      return [
        {
          key: "audit",
          title: "Oversight summary",
          icon: CircleDot,
          isAudit: true,
          stats: [
            { label: "Pending tithes", value: pendingTithes.length },
            { label: "Submitted RFs", value: rfByStatus("submitted").length },
            { label: "For approval", value: rfByStatus("for_approval").length },
            { label: "Approved (no voucher)", value: rfByStatus("approved").length },
            { label: "Awaiting disbursement", value: rfByStatus("voucher_created").length },
            { label: "Awaiting receipt", value: rfByStatus("disbursed").length },
            { label: "Vouchers this month", value: vouchersThisMonth.length },
          ],
        },
      ];
    }

    return [];
  }, [role, userId, tithes, rfs, vouchers]);

  if (!buckets) return null;

  // Hide buckets with zero items so the section only shows what actually
  // needs attention. The auditor's stats tile (`isAudit`) is always kept.
  const visibleBuckets = buckets.filter(
    (b) => b.isAudit || (b.items?.length ?? 0) > 0,
  );

  const totalItems = buckets.reduce(
    (acc, b) => acc + (b.isAudit ? 0 : b.items.length),
    0,
  );

  const allCaughtUp = !buckets.some((b) => b.isAudit) && totalItems === 0;

  const goToRf = (rf) =>
    navigate(`/request-form?focus=${rf._id}`);
  const goToTithes = (t) =>
    navigate(`/tithes?focus=${t._id}`);

  // Wraps the navigate button + action button in one row. The two click
  // targets are siblings (not nested) so React doesn't warn about
  // button-in-button and the action button doesn't trigger navigation.
  const ActionRow = ({ id, onNavigate, children, bucketKey, item }) => {
    const action = actionForRow(bucketKey, item);
    const busy = busyId === id;
    const rowError = errorById[id];
    return (
      <div className="flex flex-col gap-1.5 rounded-md px-2 py-1.5 hover:bg-muted/60 transition">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onNavigate}
            className="text-left flex items-center justify-between gap-2 flex-1 min-w-0 cursor-pointer"
          >
            {children}
          </button>
          {action && (
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={() => runAction(id, action.run)}
              className="shrink-0 bg-green-600 hover:bg-green-700 text-white disabled:opacity-70"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : null}
              {busy ? "Working…" : action.label}
            </Button>
          )}
        </div>
        {rowError && (
          <p className="text-[11px] text-red-600 leading-tight">{rowError}</p>
        )}
      </div>
    );
  };

  const renderRfRow = (rf, bucketKey) => (
    <ActionRow
      key={rf._id}
      id={rf._id}
      item={rf}
      bucketKey={bucketKey}
      onNavigate={() => goToRf(rf)}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {rf.rfNo}{" "}
          <span className="text-xs text-muted-foreground">
            · {personName(rf.requestedBy)}
          </span>
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {personName(rf.category)} · {formatShortDate(rf.entryDate)}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums">
        {formatPHP(rf.estimatedAmount)}
      </span>
    </ActionRow>
  );

  const renderTithesRow = (t, bucketKey) => (
    <ActionRow
      key={t._id}
      id={t._id}
      item={t}
      bucketKey={bucketKey}
      onNavigate={() => goToTithes(t)}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {personName(t.submittedBy)}{" "}
          <span className="text-xs text-muted-foreground">
            · {t.serviceType ?? "—"}
          </span>
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {formatShortDate(t.entryDate)}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums">
        {formatPHP(t.total)}
      </span>
    </ActionRow>
  );

  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle>Your Pending Work</CardTitle>
        <CardDescription>
          {role === "auditor"
            ? "Oversight snapshot across the pipeline."
            : allCaughtUp
              ? "Nothing waiting on you right now."
              : "Take quick action below, or click a row to open it for full details."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allCaughtUp ? (
          <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
            <Inbox className="h-8 w-8 opacity-50" />
            <p>All caught up — wala nang pending sa'yo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleBuckets.map((b) => {
              if (b.isAudit) {
                return (
                  <div
                    key={b.key}
                    className="rounded-lg border p-4 flex flex-col gap-2 bg-blue-50/40 md:col-span-2 lg:col-span-3"
                  >
                    <div className="flex items-center gap-2">
                      <b.icon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">{b.title}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                      {b.stats.map((s) => (
                        <div key={s.label} className="rounded-md bg-background p-3 border">
                          <div className="text-2xl font-semibold">{s.value}</div>
                          <div className="text-[11px] text-muted-foreground leading-tight">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <PendingSection
                  key={b.key}
                  icon={b.icon}
                  title={b.title}
                  items={b.items}
                  renderRow={(item) =>
                    b.kind === "tithes"
                      ? renderTithesRow(item, b.key)
                      : renderRfRow(item, b.key)
                  }
                  emptyText="Nothing here right now."
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
