import { Check, CircleDot, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatDateTime, formatPHP, statusConfig } from "./mockData";

const stages = [
  { key: "draft",           label: "Created",         timestampField: "createdAt",        byField: "requestedBy" },
  { key: "submitted",       label: "Submitted",       timestampField: "submittedAt",      byField: "requestedBy" },
  { key: "for_approval",    label: "Validated",       timestampField: "validatedAt",      byField: "validatedBy" },
  { key: "approved",        label: "Approved",        timestampField: "approvedAt",       byField: "approvedBy" },
  { key: "voucher_created", label: "Voucher Created", timestampField: "voucherCreatedAt", byField: null },
  { key: "disbursed",       label: "Disbursed",       timestampField: "receivedAt",       byField: "requestedBy" },
];

const personName = (val) =>
  val && typeof val === "object" ? val.name : null;

function TimelineItem({ label, timestamp, by, state, isLast }) {
  const Icon =
    state === "rejected" ? XCircle : state === "current" ? CircleDot : Check;
  const iconColor =
    state === "done"
      ? "text-green-600"
      : state === "current"
        ? "text-blue-600 animate-pulse"
        : state === "rejected"
          ? "text-red-600"
          : "text-gray-300";
  const textColor = state === "upcoming" ? "text-muted-foreground/60" : "";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {!isLast && <div className="flex-1 w-px bg-border my-1" />}
      </div>
      <div className={`pb-4 flex-1 ${textColor}`}>
        <div className="text-sm font-medium">{label}</div>
        {(timestamp || by) && (
          <div className="text-xs text-muted-foreground">
            {timestamp ? formatDateTime(timestamp) : ""}
            {timestamp && by ? " · " : ""}
            {by ? `by ${by}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export function RfDetailsDialog({ rf, open, onOpenChange }) {
  if (!rf) return null;

  const cfg = statusConfig[rf.status] ?? statusConfig.draft;
  const isRejected = rf.status === "rejected";
  const currentOrder = cfg.order;
  const requesterName = personName(rf.requestedBy) || "—";
  const categoryLabel =
    typeof rf.category === "string" ? rf.category : rf.category?.name || "—";
  const voucherLabel = rf.voucherId?.pcfNo || rf.voucherNo;

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
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

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Requester</div>
              <div className="font-medium">{requesterName}</div>
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
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
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
                const by = s.byField ? personName(rf[s.byField]) : null;
                return (
                  <TimelineItem
                    key={s.key}
                    label={s.label}
                    timestamp={timestamp}
                    by={by}
                    state={stageState(cfgStage.order)}
                    isLast={!isRejected && idx === stages.length - 1}
                  />
                );
              })}
              {isRejected && (
                <TimelineItem
                  label="Rejected"
                  timestamp={rf.rejectedAt}
                  by={personName(rf.rejectedBy)}
                  state="rejected"
                  isLast
                />
              )}
            </div>

            {isRejected && rf.rejectionNote && (
              <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-sm">
                <div className="text-xs font-medium text-red-700 mb-1">
                  Rejection Note
                </div>
                <div className="text-red-900">{rf.rejectionNote}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
