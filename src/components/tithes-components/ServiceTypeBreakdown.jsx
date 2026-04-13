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

// ============================================================
// MOCK DATA — palitan ng API fetch
// Suggested: GET /api/tithes?groupBy=serviceType
// ============================================================
const data = [
  { service: "Sunday Service",  amount: 56400, percent: 45 },
  { service: "Prayer Meeting",  amount: 27600, percent: 22 },
  { service: "Youth Service",   amount: 22600, percent: 18 },
  { service: "Special Offering", amount: 18800, percent: 15 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
};

const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

export function ServiceTypeBreakdown({ className }) {
  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Breakdown by Service</CardTitle>
        <CardDescription>Distribution per service type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
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
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Sunday Service leads with 45% of total tithes
      </CardFooter>
    </Card>
  );
}
