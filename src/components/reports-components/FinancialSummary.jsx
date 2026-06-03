import { Coins, Receipt, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP } from "./mockData";

function Tile({ label, value, sub, icon: Icon, accent, valueClass }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className={`text-2xl font-semibold ${valueClass ?? ""}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

// On-screen financial summary for the combined Reports tab. Mirrors the
// totals carried by the combined export (Total Tithes / Total Expenses / NET
// + expense by-category). Driven by the `summary` from GET /api/reports/combined.
export function FinancialSummary({ className, summary, loading }) {
  if (!summary) {
    return (
      <Card className={`w-full ${className ?? ""}`}>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>
            {loading ? "Loading…" : "Select a date range to see the summary."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const net = summary.net ?? 0;
  const positive = net >= 0;

  return (
    <div className={`flex flex-col gap-5 ${className ?? ""}`}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>
            Tithes vs expenses for the selected range
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Tile
            label="Total Tithes"
            value={formatPHP(summary.totalTithes)}
            sub={`${summary.tithesCount} entries`}
            icon={Coins}
            accent="bg-emerald-50/50 dark:bg-emerald-500/10"
          />
          <Tile
            label="Total Expenses"
            value={formatPHP(summary.totalExpenses)}
            sub={`${summary.expenseCount} entries`}
            icon={Receipt}
            accent="bg-amber-50/50 dark:bg-amber-500/10"
          />
          <Tile
            label="NET Position"
            value={formatPHP(net)}
            sub={positive ? "surplus" : "deficit"}
            icon={Scale}
            accent={positive ? "bg-blue-50/50 dark:bg-blue-500/10" : "bg-red-50/50 dark:bg-red-500/10"}
            valueClass={positive ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}
          />
        </CardContent>
      </Card>

      {summary.byCategory?.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Where the money went in this range</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {summary.byCategory.map((c) => (
              <div
                key={c.category}
                className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
              >
                <span className="text-muted-foreground truncate">{c.category}</span>
                <span className="font-medium tabular-nums shrink-0">
                  {formatPHP(c.total)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
