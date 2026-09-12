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
import { Spinner } from "@/components/ui/spinner";
import {
  formatPHP,
  monthOverMonthTrend,
  sumWithinDays,
  sumWithinRange,
} from "./dashboardUtils";

function StatTile({ label, value, icon: Icon, trend, hint, accent }) {
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
          {Math.abs(trend)}% vs last 30 days
        </div>
      )}
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function SummaryStats({
  tithes = [],
  expenses = [],
  rfs = [],
  availableBalance = 0,
  canViewExpenses = false,
  loading = false,
}) {
  const stats = useMemo(() => {
    // Approved tithes only — pending/rejected are not actual receipts.
    const approvedTithes = tithes.filter((t) => t.status === "approved");
    const tithesRecords = approvedTithes.map((t) => ({
      date: t.reviewedAt ?? t.entryDate,
      amount: t.total ?? 0,
    }));

    const tithesLast30 = sumWithinDays(tithesRecords, 30);
    const tithesPrior30 = sumWithinRange(tithesRecords, 30, 60);
    const tithesTrend = monthOverMonthTrend(tithesLast30, tithesPrior30);

    const expensesLast30 = sumWithinDays(expenses, 30);
    const expensesPrior30 = sumWithinRange(expenses, 30, 60);
    const expensesTrend = monthOverMonthTrend(expensesLast30, expensesPrior30);

    // Pending approvals: anything in submitted or for_approval status.
    // Backend filters RFs per role, so this is naturally role-aware.
    const pendingApprovals = rfs.filter(
      (rf) => rf.status === "submitted" || rf.status === "for_approval"
    ).length;

    return {
      tithesLast30,
      tithesTrend,
      expensesLast30,
      expensesTrend,
      pendingApprovals,
    };
  }, [tithes, expenses, rfs]);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>
          Last 30 days, except the balance — that is the church's current total
        </CardDescription>
      </CardHeader>
      {loading ? (
        <CardContent className="flex-1 flex items-center justify-center">
          <Spinner label="Loading summary…" />
        </CardContent>
      ) : (
      <CardContent className="grid grid-cols-2 auto-rows-fr gap-3 flex-1">
        {/* The window is in the label now. It used to read "Total Tithes" while
            summing only the last 30 days, so it disagreed with the Tithes page's
            all-time Approved figure and looked like a broken computation. */}
        <StatTile
          label="Tithes · last 30 days"
          value={formatPHP(stats.tithesLast30)}
          icon={TrendingUp}
          trend={stats.tithesTrend}
          accent="bg-green-50/50 dark:bg-green-500/10"
        />
        {canViewExpenses ? (
          <StatTile
            label="Expenses · last 30 days"
            value={formatPHP(stats.expensesLast30)}
            icon={TrendingDown}
            trend={stats.expensesTrend}
            accent="bg-red-50/50 dark:bg-red-500/10"
          />
        ) : (
          <StatTile
            label="Expenses · last 30 days"
            value="—"
            icon={TrendingDown}
            accent="bg-red-50/50 dark:bg-red-500/10"
          />
        )}
        {/* Cash on hand, straight from the API: all approved tithes minus all
            expenses, church-wide. Shown to every role — this is the number that
            decides whether a request form can be made at all, and it is the same
            figure the create-request dialog prints. It replaces a "Net Balance"
            tile that subtracted 30 days of expenses from 30 days of tithes and
            so answered a question nobody was asking. */}
        <StatTile
          label="Available Balance"
          value={formatPHP(availableBalance)}
          icon={Wallet}
          hint="free to spend now"
          accent="bg-blue-50/50 dark:bg-blue-500/10"
        />
        <StatTile
          label="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          accent="bg-amber-50/50 dark:bg-amber-500/10"
        />
      </CardContent>
      )}
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {availableBalance > 0
            ? "Funds available for new requests"
            : "No tithes balance available for new requests"}{" "}
          <Wallet className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Balance excludes approved requests that have no voucher yet
        </div>
      </CardFooter>
    </Card>
  );
}
