import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatPHP,
  monthOverMonthTrend,
  sumWithinDays,
  sumWithinRange,
} from "./dashboardUtils";

function StatTile({ label, value, icon: Icon, trend, accent }) {
  const hasTrend = trend !== undefined && trend !== null;
  const isPositive = hasTrend && trend >= 0;
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {hasTrend && (
        <div
          className={`flex items-center gap-1 text-xs ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  );
}

export function SummaryStats({
  tithes = [],
  expenses = [],
  rfs = [],
  canViewExpenses = false,
}) {
  const stats = useMemo(() => {
    // Approved tithes only — pending/rejected are not actual receipts.
    const approvedTithes = tithes.filter((t) => t.status === "approved");
    const tithesRecords = approvedTithes.map((t) => ({
      date: t.reviewedAt ?? t.entryDate,
      amount: t.total ?? 0,
    }));

    const tithesThisMonth = sumWithinDays(tithesRecords, 30);
    const tithesLastMonth = sumWithinRange(tithesRecords, 30, 60);
    const tithesTrend = monthOverMonthTrend(tithesThisMonth, tithesLastMonth);

    const expensesThisMonth = sumWithinDays(expenses, 30);
    const expensesLastMonth = sumWithinRange(expenses, 30, 60);
    const expensesTrend = monthOverMonthTrend(expensesThisMonth, expensesLastMonth);

    const netBalance = tithesThisMonth - expensesThisMonth;

    // Pending approvals: anything in submitted or for_approval status.
    // Backend filters RFs per role, so this is naturally role-aware.
    const pendingApprovals = rfs.filter(
      (rf) => rf.status === "submitted" || rf.status === "for_approval"
    ).length;

    return {
      tithesThisMonth,
      tithesTrend,
      expensesThisMonth,
      expensesTrend,
      netBalance,
      pendingApprovals,
    };
  }, [tithes, expenses, rfs]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Snapshot of this month's activity</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <StatTile
          label="Total Tithes"
          value={formatPHP(stats.tithesThisMonth)}
          icon={TrendingUp}
          trend={stats.tithesTrend}
          accent="bg-green-50/50"
        />
        {canViewExpenses ? (
          <StatTile
            label="Total Expenses"
            value={formatPHP(stats.expensesThisMonth)}
            icon={TrendingDown}
            trend={stats.expensesTrend}
            accent="bg-red-50/50"
          />
        ) : (
          <StatTile
            label="Total Expenses"
            value="—"
            icon={TrendingDown}
            accent="bg-red-50/50"
          />
        )}
        {canViewExpenses ? (
          <StatTile
            label="Net Balance"
            value={formatPHP(stats.netBalance)}
            icon={Wallet}
            accent="bg-blue-50/50"
          />
        ) : (
          <StatTile
            label="Net Balance"
            value="—"
            icon={Wallet}
            accent="bg-blue-50/50"
          />
        )}
        <StatTile
          label="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          accent="bg-amber-50/50"
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {canViewExpenses && stats.netBalance >= 0
            ? "Healthy cash flow this month"
            : canViewExpenses
            ? "Spending exceeds tithes this month"
            : "Tithes summary for this month"}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Updated as of today
        </div>
      </CardFooter>
    </Card>
  );
}
