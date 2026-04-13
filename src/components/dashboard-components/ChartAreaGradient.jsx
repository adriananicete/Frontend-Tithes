import * as React from "react";
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

// ============================================================
// 🔄 MOCK DATA — PALITAN NG API FETCH
// ============================================================
// Sa totoong app, kunin mo sa backend:
//   GET http://localhost:7001/api/reports/tithes?range=12m
//
// Gagawa ka ng useState + useEffect sa loob ng component:
//   const [chartData, setChartData] = React.useState([]);
//   React.useEffect(() => {
//     fetch("http://localhost:7001/api/reports/tithes?range=12m")
//       .then(res => res.json())
//       .then(data => setChartData(data));
//   }, []);
//
// Expected shape per row: { month: "string", tithes: number, expenses: number }
// Backend dapat mag-group by month + sum ng tithes total, same sa expenses.
// Halimbawa:
//   { month: "January",  tithes: 45000, expenses: 32000 }
//   { month: "February", tithes: 52000, expenses: 28000 }
//
// NOTE: Fixed 12 months ang ginagamit — no date range dropdown. Kung gusto mo
// later ng year selector (e.g. 2024 vs 2025), pwede mong dagdagan.
const chartData = [
  { month: "January",   tithes: 45000, expenses: 32000 },
  { month: "February",  tithes: 52000, expenses: 28000 },
  { month: "March",     tithes: 48000, expenses: 35000 },
  { month: "April",     tithes: 61000, expenses: 42000 },
  { month: "May",       tithes: 55000, expenses: 31000 },
  { month: "June",      tithes: 58000, expenses: 38000 },
  { month: "July",      tithes: 50000, expenses: 29000 },
  { month: "August",    tithes: 63000, expenses: 45000 },
  { month: "September", tithes: 57000, expenses: 33000 },
  { month: "October",   tithes: 65000, expenses: 40000 },
  { month: "November",  tithes: 72000, expenses: 48000 },
  { month: "December",  tithes: 85000, expenses: 55000 },
];

// ============================================================
// 🎨 CHART CONFIG
// ============================================================
// Pag pinalitan mo yung field names sa API response mo, update mo rin:
//   - chartConfig keys
//   - <Area dataKey="..."> sa baba (2 places: tithes & expenses)
//   - <linearGradient id="fill..."> → id must match the url(#fill...)
//   - var(--color-...) — auto-computed based sa chartConfig keys
const chartConfig = {
  tithes: {
    label: "Tithes",
    color: "var(--chart-1)", // blue (from index.css: #2b7fff)
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)", // red (from index.css: #F87171)
  },
};

export function ChartAreaGradient() {
  // ============================================================
  // 👁️ TOGGLE — show/hide expense line
  // ============================================================
  // Default: false (tithes only ang lumalabas pag-load ng page)
  // Pag pinindot yung button, true na → expense line also shows
  const [showExpenses, setShowExpenses] = React.useState(false);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
        <div className="grid flex-1 gap-1">
          {/* 🔄 PALITAN: title + description dapat match sa use case */}
          <CardTitle>Tithes Trend</CardTitle>
          <CardDescription>
            {showExpenses
              ? "Last 12 months — Tithes vs Expenses"
              : "Last 12 months"}
          </CardDescription>
        </div>

        {/* 🔘 TOGGLE BUTTON — Tithes vs Expenses */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExpenses((prev) => !prev)}
          className="sm:ml-auto"
        >
          {showExpenses ? "Hide Expenses" : "Compare with Expenses"}
        </Button>
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
              tickFormatter={(value) => value.slice(0, 3)} // "January" → "Jan"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              {/* Gradient para sa tithes area (blue fade) */}
              <linearGradient id="fillTithes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tithes)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tithes)" stopOpacity={0.1} />
              </linearGradient>

              {/* Gradient para sa expenses area (red fade) */}
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Tithes line — laging lumalabas */}
            <Area
              dataKey="tithes"
              type="natural"
              fill="url(#fillTithes)"
              fillOpacity={0.4}
              stroke="var(--color-tithes)"
              strokeWidth={2}
            />

            {/* Expenses line — only rendered kapag showExpenses === true */}
            {showExpenses && (
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
        {/* ============================================================
            🔄 FOOTER STATS — DAPAT DYNAMIC TO
            ============================================================
            Hardcoded muna. Sa totoong app:
              - Compute % change from previous year
              - Or kunin mo sa backend: /api/reports/tithes/summary?range=12m
        */}
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - December 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
