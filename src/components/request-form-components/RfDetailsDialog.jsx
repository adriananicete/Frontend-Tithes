import {
  BadgeCheck,
  Check,
  CircleDot,
  FileCheck2,
  FileText,
  PackageCheck,
  Pencil,
  Receipt,
  Send,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { can } from "@/utils/rolePermissions";
import { UserChip } from "@/components/shared/UserChip";
import { RfComments } from "./RfComments";
import { formatDate, formatDateTime, formatPHP, statusConfig } from "./mockData";

const stages = [
  { key: "draft",           label: "Created",         timestampField: "createdAt",        byField: "requestedBy" },
  { key: "submitted",       label: "Submitted",       timestampField: "submittedAt",      byField: "requestedBy" },
  { key: "for_approval",    label: "Validated",       timestampField: "validatedAt",      byField: "validatedBy" },
  { key: "approved",        label: "Approved",        timestampField: "approvedAt",       byField: "approvedBy" },
  { key: "voucher_created", label: "Voucher Created", timestampField: "voucherCreatedAt", byField: null },
  { key: "disbursed",       label: "Disbursed",       timestampField: "disbursedAt",      byField: "disbursedBy" },
  { key: "received",        label: "Received",        timestampField: "receivedAt",       byField: "receivedBy" },
];

function TimelineItem({ label, timestamp, byUser, state, isLast, showAvatar = true }) {
  const Icon =
    state === "rejected" ? XCircle : state === "current" ? CircleDot : Check;
  const iconColor =
    state === "done"
      ? "text-green-600"
      : state === "current"
        ? "text-blue-600 animate-pulse"
        : state === "rejected"
          ? "text-red-600"
          : "text-gray-300 dark:text-muted-foreground/40";
  const textColor = state === "upcoming" ? "text-muted-foreground/60" : "";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {!isLast && <div className="flex-1 w-px bg-border my-1" />}
      </div>
      <div className={`pb-4 flex-1 ${textColor}`}>
        <div className="text-sm font-medium">{label}</div>
        {(timestamp || byUser) && (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
            {timestamp && <span>{formatDateTime(timestamp)}</span>}
            {timestamp && byUser && <span>·</span>}
            {byUser && (
              <span className="inline-flex items-center gap-1.5">
                by <UserChip user={byUser} size="xs" nameClassName="text-foreground" showAvatar={showAvatar} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Action buttons surfaced in the details footer, mirroring the status →
// permission map used by RfTable's ActionMenu. Returns the list of buttons
// to render, in the order they should appear.
function buildFooterActions({ rf, role, currentUserId }) {
  const status = rf.status;
  const ownerId =
    typeof rf.requestedBy === "string" ? null : rf.requestedBy?._id;
  const isOwner = ownerId && currentUserId && ownerId === currentUserId;
  const buttons = [];

  if (status === "draft") {
    if (isOwner) {
      buttons.push({ kind: "edit", label: "Edit", icon: Pencil, variant: "outline" });
      buttons.push({ kind: "delete", label: "Delete", icon: Trash2, variant: "outline-red" });
      buttons.push({ kind: "submit", label: "Submit", icon: Send, variant: "primary" });
    }
  } else if (status === "submitted") {
    // The requester can't validate, approve, or reject their own RF —
    // conflict of interest. Decision actions are hidden when isOwner.
    if (can.rejectRf(role) && !isOwner) {
      buttons.push({ kind: "reject", label: "Reject", icon: X, variant: "danger" });
    }
    if (can.validateRf(role) && !isOwner) {
      buttons.push({ kind: "validate", label: "Validate", icon: FileCheck2, variant: "primary" });
    }
  } else if (status === "for_approval") {
    if (can.rejectRf(role) && !isOwner) {
      buttons.push({ kind: "reject", label: "Reject", icon: X, variant: "danger" });
    }
    if (can.approveRf(role) && !isOwner) {
      buttons.push({ kind: "approve", label: "Approve", icon: Check, variant: "primary" });
    }
  } else if (status === "approved") {
    if (can.createVoucherFromRf(role)) {
      buttons.push({ kind: "createVoucher", label: "Create Voucher", icon: Receipt, variant: "primary" });
    }
  } else if (status === "voucher_created") {
    if (can.disburseRf(role)) {
      buttons.push({ kind: "disburse", label: "Mark as Disbursed", icon: BadgeCheck, variant: "primary" });
    }
  } else if (status === "disbursed") {
    if (can.markRfReceived(role) && isOwner) {
      buttons.push({ kind: "received", label: "Mark as Received", icon: PackageCheck, variant: "primary" });
    }
  }

  return buttons;
}

const variantClass = {
  primary: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  "outline-red": "border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300",
  outline: "",
};

export function RfDetailsDialog({
  rf,
  open,
  onOpenChange,
  userRole,
  currentUserId,
  onRequestAction,
}) {
  if (!rf) return null;

  const cfg = statusConfig[rf.status] ?? statusConfig.draft;
  const isRejected = rf.status === "rejected";
  const currentOrder = cfg.order;
  const categoryLabel =
    typeof rf.category === "string" ? rf.category : rf.category?.name || "—";
  const voucherLabel = rf.voucherId?.pcfNo || rf.voucherNo;
  const footerButtons = buildFooterActions({ rf, role: userRole, currentUserId });

  // Comment composer is open to any staff role or the RF's own requester
  // (mirrors the backend's workflow-participant rule).
  const ownerId = typeof rf.requestedBy === "string" ? null : rf.requestedBy?._id;
  const canComment = userRole !== "member" || (!!ownerId && ownerId === currentUserId);

  // For non-rejected RFs: stage is "done" if its order < current, "current" if
  // it equals current. Once rejected, stages reached before rejection stay
  // "done" and the rest are "upcoming".
  const stageState = (stageOrder) => {
    if (isRejected) return stageOrder <= currentOrder ? "done" : "upcoming";
    if (stageOrder < currentOrder) return "done";
    if (stageOrder === currentOrder) return "current";
    return "upcoming";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle>{rf.rfNo}</DialogTitle>
            <Badge variant="secondary" className={cfg.color}>
              {cfg.label}
            </Badge>
          </div>
          <DialogDescription>
            {categoryLabel} · {formatDate(rf.entryDate)}
          </DialogDescription>
        </DialogHeader>

        {/* Two columns on desktop: left = details + status timeline,
            right = comments. Stacks to one column on mobile. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Requester</div>
              <div className="font-medium"><UserChip user={rf.requestedBy} size="sm" /></div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Estimated Amount</div>
              <div className="font-medium">{formatPHP(rf.estimatedAmount)}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-muted-foreground">Remarks</div>
              <div>{rf.remarks || "—"}</div>
            </div>
            {voucherLabel && (
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground">Voucher</div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
                  {voucherLabel}
                </Badge>
              </div>
            )}
          </div>

          {rf.attachments && rf.attachments.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Attachments</div>
              <div className="flex flex-wrap gap-2">
                {rf.attachments.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs hover:bg-muted/50"
                  >
                    <FileText className="h-3 w-3" />
                    {url.split("/").pop() || `Attachment ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-muted-foreground mb-3">
              Approval Timeline
            </div>
            <div>
              {stages.map((s, idx) => {
                const cfgStage = statusConfig[s.key];
                const timestamp = s.timestampField ? rf[s.timestampField] : null;
                const byUser = s.byField ? rf[s.byField] : null;
                // Created + Submitted both point at the requester (already shown
                // with an avatar in the field above) — keep those rows text-only.
                const showAvatar = s.key !== "draft" && s.key !== "submitted";
                return (
                  <TimelineItem
                    key={s.key}
                    label={s.label}
                    timestamp={timestamp}
                    byUser={byUser}
                    state={stageState(cfgStage.order)}
                    isLast={!isRejected && idx === stages.length - 1}
                    showAvatar={showAvatar}
                  />
                );
              })}
              {isRejected && (
                <TimelineItem
                  label="Rejected"
                  timestamp={rf.rejectedAt}
                  byUser={rf.rejectedBy}
                  state="rejected"
                  isLast
                />
              )}
            </div>

            {isRejected && rf.rejectionNote && (
              <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-sm dark:bg-red-500/10 dark:border-red-500/30">
                <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                  Rejection Note
                </div>
                <div className="text-red-900">{rf.rejectionNote}</div>
              </div>
            )}
          </div>

          </div>

          <div className="lg:border-l lg:border-border lg:pl-6">
            <RfComments rfId={rf._id} open={open} canPost={canComment} />
          </div>
        </div>

        {footerButtons.length > 0 && (
          <DialogFooter>
            {footerButtons.map((b) => (
              <Button
                key={b.kind}
                type="button"
                variant={b.variant === "outline" ? "outline" : undefined}
                onClick={() => onRequestAction?.(b.kind, rf)}
                className={variantClass[b.variant]}
              >
                <b.icon className="h-4 w-4" /> {b.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
