import { CheckCircle2, Clock, Wallet, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ============================================================
// MOCK DATA — palitan ng API fetch pag ready
// Suggested: GET /api/tithes?dateRange=30d → aggregate per status
// ============================================================
const summary = {
  total:    { amount: 125400, count: 28 },
  approved: { amount: 98200,  count: 22 },
  pending:  { amount: 12000,  count: 3 },
  rejected: { amount: 1200,   count: 1 },
};

const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

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

export function TithesSummary({ className }) {
  return (
    <Card className={`w-full h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Tithes Summary</CardTitle>
        <CardDescription>Breakdown by status (this month)</CardDescription>
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
