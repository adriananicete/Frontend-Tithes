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
  const pending = vouchers.filter((v) => v.rfId?.status === "voucher_created");
  const disbursed = vouchers.filter((v) => v.rfId?.status === "disbursed");

  const sum = (arr, getter) => arr.reduce((a, c) => a + (getter(c) || 0), 0);

  const stats = {
    total: {
      count: vouchers.length,
      amount: sum(vouchers, (v) => v.amount),
    },
    pending: {
      count: pending.length,
      amount: sum(pending, (v) => v.amount),
    },
    disbursed: {
      count: disbursed.length,
      amount: sum(disbursed, (v) => v.amount),
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
          label="Pending Receipt"
          amount={stats.pending.amount}
          count={stats.pending.count}
          unit="awaiting confirmation"
          icon={Clock}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="Disbursed"
          amount={stats.disbursed.amount}
          count={stats.disbursed.count}
          unit="completed"
          icon={CheckCircle2}
          accent="bg-emerald-50/50"
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
