import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

const chartConfig = {
  tithes: {
    label: "Tithes",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
};

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Build a 12-month series ending at the current month, filling gaps with 0.
const buildMonthlySeries = (tithes, expenses) => {
  const tithesByMonth = new Map();
  const expensesByMonth = new Map();

  for (const t of tithes) {
    if (t.status !== "approved") continue;
    const d = new Date(t.reviewedAt ?? t.entryDate ?? t.createdAt);
    if (isNaN(d)) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    tithesByMonth.set(key, (tithesByMonth.get(key) || 0) + (t.total ?? 0));
  }

  for (const e of expenses) {
    const d = new Date(e.date ?? e.createdAt);
    if (isNaN(d)) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    expensesByMonth.set(key, (expensesByMonth.get(key) || 0) + (Number(e.amount) || 0));
  }

  const today = new Date();
  const series = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    series.push({
      month: MONTH_LABELS[d.getMonth()],
      year: d.getFullYear(),
      tithes: tithesByMonth.get(key) || 0,
      expenses: expensesByMonth.get(key) || 0,
    });
  }
  return series;
};

export function ChartAreaGradient({
  tithes = [],
  expenses = [],
  canViewExpenses = false,
}) {
  const [showExpenses, setShowExpenses] = useState(false);

  const chartData = useMemo(
    () => buildMonthlySeries(tithes, expenses),
    [tithes, expenses]
  );

  // Year-over-year tithes trend, comparing the latest month to the same
  // month a year prior. With only 12 months in the series, "previous year"
  // is the first row and "current" is the last row.
  const trendStats = useMemo(() => {
    if (chartData.length === 0) return { trend: 0, periodLabel: "" };
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    const trend = first.tithes > 0
      ? Math.round(((last.tithes - first.tithes) / first.tithes) * 100)
      : (last.tithes > 0 ? 100 : 0);
    const periodLabel = `${first.month.slice(0, 3)} ${first.year} – ${last.month.slice(0, 3)} ${last.year}`;
    return { trend, periodLabel };
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Tithes Trend</CardTitle>
          <CardDescription>
            {showExpenses
              ? "Last 12 months — Tithes vs Expenses"
              : "Last 12 months"}
          </CardDescription>
        </div>

        {canViewExpenses && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExpenses((prev) => !prev)}
            className="sm:ml-auto"
          >
            {showExpenses ? "Hide Expenses" : "Compare with Expenses"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillTithes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tithes)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tithes)" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area
              dataKey="tithes"
              type="natural"
              fill="url(#fillTithes)"
              fillOpacity={0.4}
              stroke="var(--color-tithes)"
              strokeWidth={2}
            />

            {showExpenses && canViewExpenses && (
              <Area
                dataKey="expenses"
                type="natural"
                fill="url(#fillExpenses)"
                fillOpacity={0.4}
                stroke="var(--color-expenses)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trendStats.trend >= 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(trendStats.trend)}% this year{" "}
              <TrendingUp
                className={`h-4 w-4 ${trendStats.trend < 0 ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {trendStats.periodLabel}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
