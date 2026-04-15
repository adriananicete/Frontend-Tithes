import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rangePresets, resolvePreset } from "./mockData";

export function DateRangePicker({
  className,
  startDate,
  endDate,
  preset,
  onChange,
}) {
  const handlePreset = (key) => {
    const r = resolvePreset(key);
    if (!r) return;
    onChange?.({ startDate: r.start, endDate: r.end, preset: key });
  };

  const handleDate = (field, value) => {
    onChange?.({
      startDate: field === "start" ? value : startDate,
      endDate:   field === "end"   ? value : endDate,
      preset: "custom",
    });
  };

  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-0.5">
            <CardTitle>Date Range</CardTitle>
            <CardDescription>
              Select a period for the report. Exports use this range.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {rangePresets.map((p) => (
            <Button
              key={p.key}
              type="button"
              variant={preset === p.key ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreset(p.key)}
            >
              {p.label}
            </Button>
          ))}
          <Button
            type="button"
            variant={preset === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange?.({ startDate, endDate, preset: "custom" })}
          >
            Custom
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => handleDate("start", e.target.value)}
              disabled={preset !== "custom"}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => handleDate("end", e.target.value)}
              disabled={preset !== "custom"}
            />
          </div>
        </div>
        {preset !== "custom" && (
          <p className="text-xs text-muted-foreground">
            Date inputs are locked while a preset is selected. Click <span className="font-medium">Custom</span> to edit manually.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
