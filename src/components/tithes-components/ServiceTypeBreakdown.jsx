import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
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
import { formatPHP, SERVICE_TYPES } from "./tithesUtils";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
};

const computeBreakdown = (tithes) => {
  // Approved entries only — pending/rejected don't count toward "actual" tithes received.
  const approved = tithes.filter((t) => t.status === "approved");
  const totals = Object.fromEntries(SERVICE_TYPES.map((s) => [s, 0]));
  let grand = 0;
  for (const t of approved) {
    if (totals[t.serviceType] === undefined) totals[t.serviceType] = 0;
    totals[t.serviceType] += t.total || 0;
    grand += t.total || 0;
  }
  return Object.entries(totals).map(([service, amount]) => ({
    service,
    amount,
    percent: grand > 0 ? Math.round((amount / grand) * 100) : 0,
  }));
};

export function ServiceTypeBreakdown({ tithes = [], className }) {
  const data = useMemo(() => computeBreakdown(tithes), [tithes]);
  const leader = useMemo(
    () => data.reduce((a, c) => (c.amount > a.amount ? c : a), data[0] ?? { service: "—", percent: 0 }),
    [data]
  );
  const hasData = data.some((d) => d.amount > 0);

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Breakdown by Service</CardTitle>
        <CardDescription>Distribution per service type (approved only)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <YAxis
                dataKey="service"
                type="category"
                tickLine={false}
                axisLine={false}
                width={110}
                tick={{ fontSize: 12 }}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatPHP(value)}
                    hideLabel
                  />
                }
              />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="percent"
                  position="right"
                  className="fill-foreground text-xs"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No approved tithes yet.
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {hasData
          ? `${leader.service} leads with ${leader.percent}% of approved tithes`
          : "Submit and approve tithes to see the breakdown"}
      </CardFooter>
    </Card>
  );
}
