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

  const cfg = voucherStatusConfig[voucher.rfId?.status] ?? {
    label: voucher.rfId?.status ?? "—",
    color: "bg-muted text-muted-foreground",
  };

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
            {voucher.category?.name ?? "—"} · {formatDate(voucher.date)}
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
                {voucher.createdBy?.name ?? "—"} · {formatDateTime(voucher.createdAt)}
              </div>
            </div>
          </div>

          <div className="rounded-md border bg-muted/30 p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Linked Request Form</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">RF No</div>
                <div className="font-medium">{voucher.rfId?.rfNo ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Estimated Amount</div>
                <div className="font-medium">
                  {voucher.rfId?.estimatedAmount != null
                    ? formatPHP(voucher.rfId.estimatedAmount)
                    : "—"}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground">Remarks</div>
                <div className="font-medium">{voucher.rfId?.remarks || "—"}</div>
              </div>
            </div>
          </div>

          {voucher.receipts && voucher.receipts.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">
                Receipts ({voucher.receipts.length})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {voucher.receipts.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md border overflow-hidden hover:opacity-90 transition"
                  >
                    <img
                      src={url}
                      alt={`Receipt ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
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
