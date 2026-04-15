import { Archive, FileText, Layers, Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockCategories } from "./mockData";

const computeStats = () => {
  const total    = mockCategories.length;
  const rf       = mockCategories.filter((c) => c.type === "rf").length;
  const expense  = mockCategories.filter((c) => c.type === "expense").length;
  const active   = mockCategories.filter((c) => c.isActive).length;
  const inactive = total - active;
  return { total, rf, expense, active, inactive };
};

function StatTile({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function CategoriesSummaryStats({ className }) {
  const stats = computeStats();
  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Categories Overview</CardTitle>
        <CardDescription>Breakdown by type and activation status</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Total Categories"
          value={stats.total.toString()}
          sub="across all types"
          icon={Layers}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Request Form"
          value={stats.rf.toString()}
          sub="used in RF entries"
          icon={FileText}
          accent="bg-indigo-50/50"
        />
        <StatTile
          label="Expense"
          value={stats.expense.toString()}
          sub="used in expenses"
          icon={Receipt}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="Active vs Inactive"
          value={`${stats.active} / ${stats.inactive}`}
          sub="enabled vs archived"
          icon={Archive}
          accent="bg-emerald-50/50"
        />
      </CardContent>
    </Card>
  );
}
