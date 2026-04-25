import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatPHP, sourceConfig } from "./mockData";

export function ExpenseDetailsDialog({ expense, open, onOpenChange }) {
  if (!expense) return null;

  const cfg = sourceConfig[expense.source] ?? { label: expense.source, color: "" };
  const linkedRf = expense.linkedId?.rfId ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle>{formatPHP(expense.amount)}</DialogTitle>
            <Badge variant="secondary" className={cfg.color}>
              {cfg.label}
            </Badge>
          </div>
          <DialogDescription>
            {(expense.category?.name ?? "—") + " · " + formatDate(expense.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Category</div>
              <div className="font-medium">{expense.category?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="font-medium">{formatDate(expense.date)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Recorded By</div>
              <div className="font-medium">{expense.recordedBy?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Source</div>
              <div className="font-medium">{cfg.label}</div>
            </div>
            {expense.remarks && (
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground">Remarks</div>
                <div className="font-medium">{expense.remarks}</div>
              </div>
            )}
          </div>

          {expense.source === "voucher" && expense.linkedId && (
            <div className="rounded-md border bg-muted/30 p-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Linked Voucher</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">PCF No</div>
                  <div className="font-medium">{expense.linkedId.pcfNo ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">RF No</div>
                  <div className="font-medium">{linkedRf?.rfNo ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Requester</div>
                  <div className="font-medium">{linkedRf?.requestedBy?.name ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Approved By</div>
                  <div className="font-medium">{linkedRf?.approvedBy?.name ?? "—"}</div>
                </div>
              </div>
            </div>
          )}

          {expense.source === "manual" && (
            <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Manually recorded expense — not linked to a voucher.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
