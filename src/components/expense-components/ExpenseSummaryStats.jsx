import { BarChart3, CalendarDays, TrendingDown, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP, mockExpenses } from "./mockData";

const daysBetween = (d) => (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);

const computeStats = () => {
  const thisMonth  = mockExpenses.filter((e) => daysBetween(e.date) <= 30);
  const last3Mos   = mockExpenses.filter((e) => daysBetween(e.date) <= 90);
  const thisYear   = mockExpenses.filter(
    (e) => new Date(e.date).getFullYear() === new Date().getFullYear()
  );
  const voucher = mockExpenses.filter((e) => e.source === "voucher");
  const manual  = mockExpenses.filter((e) => e.source === "manual");

  const sum = (arr) => arr.reduce((a, c) => a + c.amount, 0);

  return {
    thisMonth: { amount: sum(thisMonth), count: thisMonth.length },
    last3Mos:  { amount: sum(last3Mos),  count: last3Mos.length },
    thisYear:  { amount: sum(thisYear),  count: thisYear.length },
    split: {
      voucherAmount: sum(voucher),
      voucherCount:  voucher.length,
      manualAmount:  sum(manual),
      manualCount:   manual.length,
    },
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

function SplitTile({ split }) {
  return (
    <div className="rounded-lg border p-4 flex flex-col gap-2 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Auto vs Manual</span>
        <Zap className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs text-blue-700 font-medium">Voucher</div>
          <div className="text-sm font-semibold">{formatPHP(split.voucherAmount)}</div>
          <div className="text-xs text-muted-foreground">{split.voucherCount} entries</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <div className="text-xs text-purple-700 font-medium">Manual</div>
          <div className="text-sm font-semibold">{formatPHP(split.manualAmount)}</div>
          <div className="text-xs text-muted-foreground">{split.manualCount} entries</div>
        </div>
      </div>
    </div>
  );
}

export function ExpenseSummaryStats({ className }) {
  const stats = computeStats();
  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
        <CardDescription>Totals across time periods and entry sources</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="This Month"
          amount={stats.thisMonth.amount}
          count={stats.thisMonth.count}
          unit="expenses"
          icon={CalendarDays}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Last 3 Months"
          amount={stats.last3Mos.amount}
          count={stats.last3Mos.count}
          unit="expenses"
          icon={TrendingDown}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="This Year"
          amount={stats.thisYear.amount}
          count={stats.thisYear.count}
          unit="expenses"
          icon={BarChart3}
          accent="bg-emerald-50/50"
        />
        <SplitTile split={stats.split} />
      </CardContent>
    </Card>
  );
}
