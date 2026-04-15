import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================================
// MOCK DATA — palitan ng API fetch
// TODO: GET /api/reports/expense?range=30d&source=voucher
// ============================================================
const mockDaily = Array.from({ length: 365 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (364 - i));
  const base = 800 + Math.sin(i / 10) * 500 + Math.random() * 900;
  return {
    date: d.toISOString().slice(0, 10),
    voucher: Math.round(base * 1.4),
    manual:  Math.round(base * 0.5),
  };
});

const rangePresets = [
  { label: "7D",  days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y",  days: 365 },
];

const sourceOptions = [
  { value: "all",     label: "All Sources" },
  { value: "voucher", label: "Voucher Only" },
  { value: "manual",  label: "Manual Only" },
];

const chartConfig = {
  total: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
};

const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

const formatShortDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function ExpenseTrendChart({ className }) {
  const [rangeDays, setRangeDays] = useState(30);
  const [source, setSource] = useState("all");

  const chartData = useMemo(() => {
    const sliced = mockDaily.slice(-rangeDays);
    return sliced.map((row) => {
      const total =
        source === "all"
          ? row.voucher + row.manual
          : row[source];
      return { date: row.date, total };
    });
  }, [rangeDays, source]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return { sum: 0, avg: 0, peak: null, trend: 0 };
    const sum = chartData.reduce((a, c) => a + c.total, 0);
    const avg = Math.round(sum / chartData.length);
    const peak = chartData.reduce((a, c) => (c.total > a.total ? c : a), chartData[0]);
    const half = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, half).reduce((a, c) => a + c.total, 0) || 1;
    const secondHalf = chartData.slice(half).reduce((a, c) => a + c.total, 0);
    const trend = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
    return { sum, avg, peak, trend };
  }, [chartData]);

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <CardTitle>Expense Trend</CardTitle>
          <CardDescription>
            {formatShortDate(chartData[0]?.date)} – {formatShortDate(chartData[chartData.length - 1]?.date)}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex rounded-md border overflow-hidden">
            {rangePresets.map((r) => (
              <Button
                key={r.label}
                variant={rangeDays === r.days ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setRangeDays(r.days)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={formatShortDate}
              minTickGap={32}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => formatShortDate(v)}
                  formatter={(value) => formatPHP(value)}
                />
              }
            />
            <Area
              dataKey="total"
              type="monotone"
              fill="url(#fillExpense)"
              stroke="var(--color-total)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-sm">
        <div className="flex gap-6">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-semibold">{formatPHP(stats.sum)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Daily Avg</div>
            <div className="font-semibold">{formatPHP(stats.avg)}</div>
          </div>
          {stats.peak && (
            <div>
              <div className="text-xs text-muted-foreground">Peak Day</div>
              <div className="font-semibold">
                {formatShortDate(stats.peak.date)} · {formatPHP(stats.peak.total)}
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            stats.trend >= 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          <TrendingUp className={`h-3 w-3 ${stats.trend < 0 ? "rotate-180" : ""}`} />
          {stats.trend >= 0 ? "+" : ""}
          {stats.trend}% vs previous half
        </div>
      </CardFooter>
    </Card>
  );
}
