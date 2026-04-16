import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatDateTime, formatPHP, voucherStatusConfig } from "./mockData";

export function VoucherDetailsDialog({ voucher, open, onOpenChange }) {
  if (!voucher) return null;

  const cfg = voucherStatusConfig[voucher.linkedRfStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle>{voucher.pcfNo}</DialogTitle>
            <Badge variant="secondary" className={cfg.color}>
              {cfg.label}
            </Badge>
          </div>
          <DialogDescription>
            {voucher.category} · {formatDate(voucher.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="font-medium">{formatPHP(voucher.amount)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Created By</div>
              <div className="font-medium">
                {voucher.createdBy} · {formatDateTime(voucher.createdAt)}
              </div>
            </div>
            {voucher.receivedAt && (
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground">Received</div>
                <div className="font-medium">
                  {formatDateTime(voucher.receivedAt)} · by {voucher.linkedRf.requestedBy}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-md border bg-muted/30 p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Linked Request Form</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">RF No</div>
                <div className="font-medium">{voucher.linkedRf.rfNo}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Requester</div>
                <div className="font-medium">{voucher.linkedRf.requestedBy}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Entry Date</div>
                <div className="font-medium">{formatDate(voucher.linkedRf.entryDate)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Remarks</div>
                <div className="font-medium">{voucher.linkedRf.remarks || "—"}</div>
              </div>
            </div>
          </div>

          {voucher.receipts && voucher.receipts.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Receipts</div>
              <div className="flex flex-wrap gap-2">
                {voucher.receipts.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs hover:bg-muted/50"
                  >
                    <FileText className="h-3 w-3" />
                    {url.split("/").pop() || `Receipt ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
