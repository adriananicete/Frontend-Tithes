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

// `data` arrives pre-aggregated from GET /expenses/by-category — an array
// of { category, amount } category totals for the last 6 months, sorted
// amount-desc by the backend. This endpoint is open to every role, so the
// chart can render for all of them.
export function ChartBarExpense({ data = [] }) {
  const chartData = data;
  const total = useMemo(
    () => chartData.reduce((a, c) => a + c.amount, 0),
    [chartData],
  );

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
