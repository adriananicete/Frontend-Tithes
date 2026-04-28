import { CheckCircle2, Clock, FileClock, Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP } from "./mockData";

function StatTile({ label, amount, count, unit, icon: Icon, accent }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{formatPHP(amount)}</div>
      <div className="text-xs text-muted-foreground">
        {count} {unit}
      </div>
    </div>
  );
}

export function VoucherSummaryStats({
  className,
  vouchers = [],
  approvedRfs = [],
}) {
  const awaitingDisbursement = vouchers.filter(
    (v) => v.rfId?.status === "voucher_created",
  );
  const pendingReceipt = vouchers.filter(
    (v) => v.rfId?.status === "disbursed",
  );

  const sum = (arr, getter) => arr.reduce((a, c) => a + (getter(c) || 0), 0);

  const stats = {
    total: {
      count: vouchers.length,
      amount: sum(vouchers, (v) => v.amount),
    },
    awaitingDisbursement: {
      count: awaitingDisbursement.length,
      amount: sum(awaitingDisbursement, (v) => v.amount),
    },
    pendingReceipt: {
      count: pendingReceipt.length,
      amount: sum(pendingReceipt, (v) => v.amount),
    },
    awaiting: {
      count: approvedRfs.length,
      amount: sum(approvedRfs, (r) => r.estimatedAmount),
    },
  };

  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Voucher Summary</CardTitle>
        <CardDescription>Overview of issued vouchers and pending actions</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Total Vouchers Issued"
          amount={stats.total.amount}
          count={stats.total.count}
          unit="vouchers"
          icon={Receipt}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Awaiting Disbursement"
          amount={stats.awaitingDisbursement.amount}
          count={stats.awaitingDisbursement.count}
          unit="for admin/DO action"
          icon={Clock}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="Pending Receipt"
          amount={stats.pendingReceipt.amount}
          count={stats.pendingReceipt.count}
          unit="awaiting requester"
          icon={CheckCircle2}
          accent="bg-cyan-50/50"
        />
        <StatTile
          label="RFs Awaiting Voucher"
          amount={stats.awaiting.amount}
          count={stats.awaiting.count}
          unit="approved RFs"
          icon={FileClock}
          accent="bg-purple-50/50"
        />
      </CardContent>
    </Card>
  );
}
