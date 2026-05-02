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

// Church started using the system in 2026 — dropdown grows with the calendar
// (today: [2026]; in 2027: [2027, 2026]; etc.) so members can always switch
// back to past years once new ones exist.
const FIRST_YEAR = 2026;

const buildYearOptions = (currentYear) => {
  const start = Math.min(FIRST_YEAR, currentYear);
  const out = [];
  for (let y = currentYear; y >= start; y--) out.push(y);
  return out;
};

// Latest month (0..11) within `year` that has any approved-tithes record.
// Returns -1 when the year has no approved tithes at all.
const lastDataMonthInYear = (records, year) => {
  let last = -1;
  for (const r of records) {
    const d = new Date(r.date);
    if (isNaN(d) || d.getFullYear() !== year) continue;
    if (d.getMonth() > last) last = d.getMonth();
  }
  return last;
};

// Build the chart series from January through the latest month that has
// any approved tithes for the selected year, zero-filling gaps. Returns
// an empty array when the year has no approved tithes — Adrian's rule:
// the chart only extends as far as actual approved data goes, so May 2026
// won't appear until a tithes entry for May has been approved.
const buildYearSeries = ({ approvedTithes, expenses, year }) => {
  const lastMonth = lastDataMonthInYear(approvedTithes, year);
  if (lastMonth < 0) return [];

  const tithesByMonth = new Map();
  const expensesByMonth = new Map();

  for (const t of approvedTithes) {
    const d = new Date(t.date);
    if (isNaN(d) || d.getFullYear() !== year) continue;
    const m = d.getMonth();
    if (m > lastMonth) continue;
    tithesByMonth.set(m, (tithesByMonth.get(m) || 0) + (t.amount || 0));
  }

  for (const e of expenses) {
    const d = new Date(e.date ?? e.createdAt);
    if (isNaN(d) || d.getFullYear() !== year) continue;
    const m = d.getMonth();
    if (m > lastMonth) continue;
    expensesByMonth.set(m, (expensesByMonth.get(m) || 0) + (Number(e.amount) || 0));
  }

  const series = [];
  for (let m = 0; m <= lastMonth; m++) {
    series.push({
      month: MONTH_LABELS[m],
      year,
      tithes: tithesByMonth.get(m) || 0,
      expenses: expensesByMonth.get(m) || 0,
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

  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => buildYearOptions(currentYear), [currentYear]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Normalize approved tithes into {date, amount} so the year/month math
  // only walks one shape (entries can have either reviewedAt or entryDate).
  const approvedTithes = useMemo(
    () =>
      tithes
        .filter((t) => t.status === "approved")
        .map((t) => ({
          date: t.reviewedAt ?? t.entryDate ?? t.createdAt,
          amount: t.total ?? 0,
        })),
    [tithes],
  );

  const chartData = useMemo(
    () => buildYearSeries({ approvedTithes, expenses, year: selectedYear }),
    [approvedTithes, expenses, selectedYear],
  );

  // Trend = sum of selected year's visible months vs the same months of
  // the prior year. "Same months" keeps the comparison fair when the
  // current year is partial (Jan–Apr 2026 vs Jan–Apr 2025, not full 2025).
  const trendStats = useMemo(() => {
    if (chartData.length === 0) return null;

    const visibleMonths = chartData.length;
    const sumYearYtd = (year) => {
      let total = 0;
      for (const t of approvedTithes) {
        const d = new Date(t.date);
        if (isNaN(d) || d.getFullYear() !== year) continue;
        if (d.getMonth() >= visibleMonths) continue;
        total += t.amount || 0;
      }
      return total;
    };

    const priorYearHasAnyData = approvedTithes.some((t) => {
      const d = new Date(t.date);
      return !isNaN(d) && d.getFullYear() === selectedYear - 1;
    });
    if (!priorYearHasAnyData) return { firstYear: true };

    const current = sumYearYtd(selectedYear);
    const prior = sumYearYtd(selectedYear - 1);
    if (prior <= 0) return { noPriorYtd: true };

    const trend = Math.round(((current - prior) / prior) * 100);
    return { trend };
  }, [approvedTithes, chartData, selectedYear]);

  const periodLabel =
    chartData.length === 0
      ? ""
      : `${chartData[0].month.slice(0, 3)} – ${chartData[chartData.length - 1].month.slice(0, 3)} ${selectedYear}`;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Tithes Trend</CardTitle>
          <CardDescription>
            {chartData.length === 0
              ? `No approved tithes for ${selectedYear} yet`
              : showExpenses
                ? `Tithes vs Expenses · ${selectedYear}`
                : `Tithes for ${selectedYear}`}
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger size="sm" className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {canViewExpenses && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExpenses((prev) => !prev)}
            >
              {showExpenses ? "Hide Expenses" : "Compare with Expenses"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[16rem] items-center justify-center text-sm text-muted-foreground">
            No data to display for {selectedYear}.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 16, left: 12, right: 12, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis hide domain={[0, "dataMax"]} />
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

              {/* `monotone` (not `natural`) so the spline never overshoots
                  the data range — with few data points, natural cubic
                  curves can dip below 0 or shoot above max, making the
                  line look like it leaks out of the chart area. */}
              <Area
                dataKey="tithes"
                type="monotone"
                fill="url(#fillTithes)"
                fillOpacity={0.4}
                stroke="var(--color-tithes)"
                strokeWidth={2}
                dot={chartData.length <= 2}
              />

              {showExpenses && canViewExpenses && (
                <Area
                  dataKey="expenses"
                  type="monotone"
                  fill="url(#fillExpenses)"
                  fillOpacity={0.4}
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                  dot={chartData.length <= 2}
                />
              )}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {trendStats === null ? (
              <div className="leading-none text-muted-foreground">
                Pick a year with approved tithes to see the trend.
              </div>
            ) : trendStats.firstYear ? (
              <>
                <div className="leading-none font-medium">
                  First year with approved tithes
                </div>
                <div className="leading-none text-muted-foreground">
                  {periodLabel} · no prior year to compare against
                </div>
              </>
            ) : trendStats.noPriorYtd ? (
              <>
                <div className="leading-none font-medium">
                  No comparable months in {selectedYear - 1}
                </div>
                <div className="leading-none text-muted-foreground">
                  {periodLabel}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 leading-none font-medium">
                  {trendStats.trend >= 0 ? "Trending up" : "Trending down"} by{" "}
                  {Math.abs(trendStats.trend)}% vs {selectedYear - 1}{" "}
                  <TrendingUp
                    className={`h-4 w-4 ${trendStats.trend < 0 ? "rotate-180" : ""}`}
                  />
                </div>
                <div className="leading-none text-muted-foreground">
                  {periodLabel}
                </div>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
