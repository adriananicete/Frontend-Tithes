import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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
import { formatPHP } from "./dashboardUtils";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-3)",
  },
  label: {
    color: "var(--background)",
  },
};

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

const buildCategorySeries = (expenses) => {
  const cutoff = Date.now() - SIX_MONTHS_MS;
  const byCategory = new Map();
  for (const e of expenses) {
    const ts = new Date(e.date ?? e.createdAt).getTime();
    if (isNaN(ts) || ts < cutoff) continue;
    const name = e.category?.name ?? "Uncategorized";
    byCategory.set(name, (byCategory.get(name) || 0) + (Number(e.amount) || 0));
  }
  return Array.from(byCategory, ([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export function ChartBarExpense({ expenses = [] }) {
  const chartData = useMemo(() => buildCategorySeries(expenses), [expenses]);
  const total = chartData.reduce((a, c) => a + c.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            No expenses recorded in the last 6 months.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="amount" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) => formatPHP(value)}
                  />
                }
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={4}>
                <LabelList
                  dataKey="category"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="amount"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(v) => formatPHP(v)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {chartData.length} categories <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {formatPHP(total)} total expenses in the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
