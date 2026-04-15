import { BarChart3, Calculator, FileBarChart, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP } from "./mockData";

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

export function ReportSummary({ className, tab, data }) {
  const amountKey = tab === "tithes" ? "total" : "amount";
  const groupKey  = tab === "tithes" ? "serviceType" : "category";
  const groupLabel = tab === "tithes" ? "Top Service" : "Top Category";

  const total = data.reduce((a, c) => a + (c[amountKey] || 0), 0);
  const count = data.length;
  const avg = count > 0 ? Math.round(total / count) : 0;

  const byGroup = {};
  data.forEach((row) => {
    const k = row[groupKey];
    byGroup[k] = (byGroup[k] || 0) + (row[amountKey] || 0);
  });
  const topEntry = Object.entries(byGroup).sort((a, b) => b[1] - a[1])[0];

  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Report Summary</CardTitle>
        <CardDescription>
          Computed from {count} {tab === "tithes" ? "tithe entries" : "expense entries"} in the selected range
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Total Amount"
          value={formatPHP(total)}
          sub={`${count} entries`}
          icon={FileBarChart}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Entry Count"
          value={count.toString()}
          sub={tab === "tithes" ? "tithes submitted" : "expenses recorded"}
          icon={BarChart3}
          accent="bg-amber-50/50"
        />
        <StatTile
          label="Average per Entry"
          value={formatPHP(avg)}
          sub={count > 0 ? "mean value" : "no entries"}
          icon={Calculator}
          accent="bg-emerald-50/50"
        />
        <StatTile
          label={groupLabel}
          value={topEntry ? topEntry[0] : "—"}
          sub={topEntry ? formatPHP(topEntry[1]) : "no data"}
          icon={Trophy}
          accent="bg-purple-50/50"
        />
      </CardContent>
    </Card>
  );
}
