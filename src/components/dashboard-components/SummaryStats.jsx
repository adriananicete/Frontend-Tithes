import { TrendingUp, TrendingDown, Wallet, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ============================================================
// MOCK DATA — palitan ng API fetch
// Suggested endpoints:
//   GET /api/reports/tithes?range=1m      → totalTithes
//   GET /api/reports/expense?range=1m     → totalExpenses
//   GET /api/request-form?status=submitted,for_approval  → pendingApprovals count
// ============================================================
const summary = {
  totalTithes: 48500,
  tithesTrend: 12.4,
  totalExpenses: 23800,
  expensesTrend: -3.2,
  netBalance: 24700,
  pendingApprovals: 5,
};

const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

function StatTile({ label, value, icon: Icon, trend, accent }) {
  const isPositive = trend !== undefined && trend >= 0;
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {trend !== undefined && (
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

export function SummaryStats() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Snapshot of this month's activity</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <StatTile
          label="Total Tithes"
          value={formatPHP(summary.totalTithes)}
          icon={TrendingUp}
          trend={summary.tithesTrend}
          accent="bg-green-50/50"
        />
        <StatTile
          label="Total Expenses"
          value={formatPHP(summary.totalExpenses)}
          icon={TrendingDown}
          trend={summary.expensesTrend}
          accent="bg-red-50/50"
        />
        <StatTile
          label="Net Balance"
          value={formatPHP(summary.netBalance)}
          icon={Wallet}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Pending Approvals"
          value={summary.pendingApprovals}
          icon={Clock}
          accent="bg-amber-50/50"
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Healthy cash flow this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Updated as of today
        </div>
      </CardFooter>
    </Card>
  );
}
