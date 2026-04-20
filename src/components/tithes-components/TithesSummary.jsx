import { useMemo } from "react";
import { CheckCircle2, Clock, Wallet, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP } from "./tithesUtils";

const computeSummary = (tithes) => {
  const acc = {
    total:    { amount: 0, count: 0 },
    approved: { amount: 0, count: 0 },
    pending:  { amount: 0, count: 0 },
    rejected: { amount: 0, count: 0 },
  };
  for (const t of tithes) {
    acc.total.amount += t.total || 0;
    acc.total.count += 1;
    if (acc[t.status]) {
      acc[t.status].amount += t.total || 0;
      acc[t.status].count += 1;
    }
  }
  return acc;
};

function StatTile({ label, amount, count, icon: Icon, accent }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{formatPHP(amount)}</div>
      <div className="text-xs text-muted-foreground">{count} entries</div>
    </div>
  );
}

export function TithesSummary({ tithes = [], className }) {
  const summary = useMemo(() => computeSummary(tithes), [tithes]);
  return (
    <Card className={`w-full h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Tithes Summary</CardTitle>
        <CardDescription>Breakdown by status (all entries)</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <StatTile
          label="Total Collected"
          amount={summary.total.amount}
          count={summary.total.count}
          icon={Wallet}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Approved"
          amount={summary.approved.amount}
          count={summary.approved.count}
          icon={CheckCircle2}
          accent="bg-green-50/50"
        />
        <StatTile
          label="Pending"
          amount={summary.pending.amount}
          count={summary.pending.count}
          icon={Clock}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="Rejected"
          amount={summary.rejected.amount}
          count={summary.rejected.count}
          icon={XCircle}
          accent="bg-red-50/50"
        />
      </CardContent>
    </Card>
  );
}
