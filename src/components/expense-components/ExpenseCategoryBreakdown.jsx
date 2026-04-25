import { useMemo } from "react";
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
import { formatPHP } from "./mockData";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-3)",
  },
  label: {
    color: "var(--background)",
  },
};

export function ExpenseCategoryBreakdown({ expenses = [], className }) {
  const chartData = useMemo(() => {
    const byCat = {};
    expenses.forEach((e) => {
      const name = e.category?.name ?? "Uncategorized";
      byCat[name] = (byCat[name] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(byCat)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const top = chartData[0];
  const total = chartData.reduce((a, c) => a + c.amount, 0);

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Distribution across all recorded categories</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No expenses to display.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ right: 48, left: 8 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
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
                  fontSize={11}
                  formatter={(v) => formatPHP(v)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 border-t pt-3 text-sm">
        {top && (
          <div className="leading-none font-medium">
            Top category: <span className="text-primary">{top.category}</span> · {formatPHP(top.amount)}
          </div>
        )}
        <div className="leading-none text-xs text-muted-foreground">
          {chartData.length} categories · {formatPHP(total)} total
        </div>
      </CardFooter>
    </Card>
  );
}
