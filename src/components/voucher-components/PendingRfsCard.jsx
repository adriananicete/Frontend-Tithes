import { ArrowRight, FileClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatPHP } from "./mockData";

export function PendingRfsCard({
  className,
  rfs = [],
  loading = false,
  error = "",
  onCreateVoucher,
}) {
  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileClock className="h-5 w-5 text-purple-600" />
              Approved RFs Awaiting Voucher
            </CardTitle>
            <CardDescription>
              Click an RF to issue its PCF voucher
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {rfs.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Loading approved RFs…
          </div>
        ) : error ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : rfs.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No approved RFs awaiting voucher. You're all caught up.
          </div>
        ) : (
          <div className="flex gap-3">
            {rfs.map((rf) => (
              <button
                key={rf._id}
                type="button"
                onClick={() => onCreateVoucher?.(rf._id)}
                className="group text-left rounded-lg border p-3 hover:bg-muted/50 hover:border-purple-300 transition flex flex-col gap-2 shrink-0 w-72"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{rf.rfNo}</span>
                  <span className="text-sm font-medium">
                    {formatPHP(rf.estimatedAmount)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {rf.requestedBy?.name ?? "—"} · {rf.category?.name ?? "—"} ·{" "}
                  {rf.remarks || "—"}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Approved {formatDate(rf.approvedAt ?? rf.createdAt)}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-purple-700 opacity-0 group-hover:opacity-100 transition">
                    Create Voucher <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
