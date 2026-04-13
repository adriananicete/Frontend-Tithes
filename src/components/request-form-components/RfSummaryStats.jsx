import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP, mockRfs } from "./mockData";

const computeStats = () => {
  const active = mockRfs.filter((r) =>
    ["draft", "submitted", "for_approval", "approved", "voucher_created"].includes(r.status)
  );
  const pendingDisb = mockRfs.filter((r) =>
    ["approved", "voucher_created"].includes(r.status)
  );
  const approvedThisMonth = mockRfs.filter((r) => r.status === "approved");
  const rejectedThisMonth = mockRfs.filter((r) => r.status === "rejected");

  const sum = (arr) => arr.reduce((a, c) => a + c.estimatedAmount, 0);

  return {
    active: { count: active.length, amount: sum(active) },
    pendingDisb: { count: pendingDisb.length, amount: sum(pendingDisb) },
    approved: { count: approvedThisMonth.length, amount: sum(approvedThisMonth) },
    rejected: { count: rejectedThisMonth.length, amount: sum(rejectedThisMonth) },
  };
};

function StatTile({ label, amount, count, icon: Icon, accent }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{formatPHP(amount)}</div>
      <div className="text-xs text-muted-foreground">{count} requests</div>
    </div>
  );
}

export function RfSummaryStats({ className }) {
  const stats = computeStats();
  return (
    <Card className={`w-full h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Request Form Summary</CardTitle>
        <CardDescription>Status overview across all requests</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <StatTile
          label="Total Active"
          amount={stats.active.amount}
          count={stats.active.count}
          icon={Activity}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Pending Disbursement"
          amount={stats.pendingDisb.amount}
          count={stats.pendingDisb.count}
          icon={Clock}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="Approved This Month"
          amount={stats.approved.amount}
          count={stats.approved.count}
          icon={CheckCircle2}
          accent="bg-green-50/50"
        />
        <StatTile
          label="Rejected This Month"
          amount={stats.rejected.amount}
          count={stats.rejected.count}
          icon={XCircle}
          accent="bg-red-50/50"
        />
      </CardContent>
    </Card>
  );
}
