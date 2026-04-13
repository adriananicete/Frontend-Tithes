import {
  Check,
  CircleDot,
  FileText,
  XCircle,
} from "lucide-react";
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
  { key: "createdAt",         label: "Created",         byKey: "requestedBy" },
  { key: "submittedAt",       label: "Submitted",       byKey: "requestedBy" },
  { key: "validatedAt",       label: "Validated",       byKey: "validatedBy" },
  { key: "approvedAt",        label: "Approved",        byKey: "approvedBy" },
  { key: "voucherCreatedAt",  label: "Voucher Created", byKey: "voucherCreatedBy" },
  { key: "receivedAt",        label: "Disbursed",       byKey: "requestedBy" },
];

function TimelineItem({ label, timestamp, by, state }) {
  const Icon = state === "rejected" ? XCircle : state === "current" ? CircleDot : Check;
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
        <div className="flex-1 w-px bg-border my-1" />
      </div>
      <div className={`pb-4 flex-1 ${textColor}`}>
        <div className="text-sm font-medium">{label}</div>
        {timestamp && (
          <div className="text-xs text-muted-foreground">
            {formatDateTime(timestamp)}
            {by && ` · by ${by}`}
          </div>
        )}
      </div>
    </div>
  );
}

export function RfDetailsDialog({ rf, open, onOpenChange }) {
  if (!rf) return null;

  const cfg = statusConfig[rf.status];
  const t = rf.timeline || {};
  const isRejected = rf.status === "rejected";

  const getState = (stageKey) => {
    if (isRejected && t[stageKey]) return "done";
    if (isRejected && !t[stageKey]) return "upcoming";
    if (t[stageKey]) return "done";
    const currentStageIdx = stages.findIndex((s) => !t[s.key]);
    if (stages[currentStageIdx]?.key === stageKey) return "current";
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
            {rf.category} · {formatDate(rf.entryDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Requester</div>
              <div className="font-medium">{rf.requestedBy}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Estimated Amount</div>
              <div className="font-medium">{formatPHP(rf.estimatedAmount)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground">Remarks</div>
              <div>{rf.remarks || "—"}</div>
            </div>
            {rf.voucherNo && (
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Voucher</div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {rf.voucherNo}
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
            <div className="text-xs text-muted-foreground mb-3">Approval Timeline</div>
            <div>
              {stages.map((s) => (
                <TimelineItem
                  key={s.key}
                  label={s.label}
                  timestamp={t[s.key]}
                  by={t[s.byKey] || (s.byKey === "requestedBy" ? rf.requestedBy : null)}
                  state={getState(s.key)}
                />
              ))}
              {isRejected && (
                <TimelineItem
                  label="Rejected"
                  timestamp={t.rejectedAt}
                  by={t.rejectedBy}
                  state="rejected"
                />
              )}
            </div>

            {isRejected && rf.rejectionNote && (
              <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-sm">
                <div className="text-xs font-medium text-red-700 mb-1">Rejection Note</div>
                <div className="text-red-900">{rf.rejectionNote}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
