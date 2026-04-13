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

// ============================================================
// 🔄 MOCK DATA — PALITAN NG API FETCH
// ============================================================
// Sa totoong app, kunin mo sa backend:
//   GET http://localhost:7001/api/expenses
//   or
//   GET http://localhost:7001/api/reports/expense
//
// Gagawa ka ng useState + useEffect sa loob ng component:
//   const [chartData, setChartData] = React.useState([]);
//   React.useEffect(() => {
//     fetch("http://localhost:7001/api/reports/expense")
//       .then(res => res.json())
//       .then(data => {
//         // Transform mo kung needed — gawing array ng { category, amount }
//         setChartData(data);
//       });
//   }, []);
//
// Expected shape per row: { category: "string", amount: number }
// Halimbawa:
//   { category: "Utilities", amount: 15000 }
//   { category: "Food",      amount: 8500 }
//
// NOTE: Backend mo may categories collection na ("Utilities", "Events", "Food", etc.)
// at yung expenses endpoint pwedeng mag-group by category + sum ng amount.
const chartData = [
  { category: "Utilities", amount: 15000 },
  { category: "Food", amount: 8500 },
  { category: "Events", amount: 25000 },
  { category: "Missions", amount: 12000 },
  { category: "Transport", amount: 6000 },
  { category: "Supplies", amount: 4500 },
];

// ============================================================
// 🎨 CHART CONFIG
// ============================================================
// Pag pinalitan mo yung `amount` field (e.g. "total"), palitan mo rin:
//   - chartConfig key: amount → total
//   - <XAxis dataKey="amount"> → "total"
//   - <Bar dataKey="amount">   → "total"
//   - <LabelList dataKey="amount"> → "total"
//   - var(--color-amount) → var(--color-total)
const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-3)", // teal-ish sa light mode, green sa dark
  },
  label: {
    color: "var(--background)", // kulay ng category text sa loob ng bar
  },
};

export function ChartBarExpense() {
  return (
    <Card>
      <CardHeader>
        {/* 🔄 PALITAN: title + description dapat match sa use case */}
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical" // horizontal bars (category sa kaliwa, bar lumalabas sa kanan)
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />

            {/* Category axis (Y) — hidden pero ginagamit para sa labels */}
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />

            {/* Amount axis (X) — hidden rin, numeric */}
            <XAxis dataKey="amount" type="number" hide />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            {/* Yung actual bars */}
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4}>
              {/* Label #1: category name SA LOOB ng bar (kaliwa) */}
              <LabelList
                dataKey="category"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              {/* Label #2: amount SA DULO ng bar (kanan) */}
              <LabelList
                dataKey="amount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* ============================================================
            🔄 FOOTER STATS — DAPAT DYNAMIC TO
            ============================================================
            Hardcoded muna yung "5.2%" at "last 6 months". Sa totoong app:
              - Compute % change from previous period
              - Or kunin mo sa backend: /api/reports/expense/summary
        */}
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
