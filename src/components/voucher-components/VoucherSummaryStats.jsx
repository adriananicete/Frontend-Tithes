import { CheckCircle2, Clock, FileClock, Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP, mockApprovedRfs, mockVouchers } from "./mockData";

const computeStats = () => {
  const total = mockVouchers;
  const pending = mockVouchers.filter((v) => v.linkedRfStatus === "voucher_created");
  const disbursed = mockVouchers.filter((v) => v.linkedRfStatus === "disbursed");
  const awaiting = mockApprovedRfs;

  const sum = (arr, key = "amount") => arr.reduce((a, c) => a + c[key], 0);

  return {
    total: { count: total.length, amount: sum(total) },
    pending: { count: pending.length, amount: sum(pending) },
    disbursed: { count: disbursed.length, amount: sum(disbursed) },
    awaiting: { count: awaiting.length, amount: sum(awaiting, "estimatedAmount") },
  };
};

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

export function VoucherSummaryStats({ className }) {
  const stats = computeStats();
  return (
    <Card className={`w-full h-auto lg:h-80 ${className ?? ""}`}>
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
