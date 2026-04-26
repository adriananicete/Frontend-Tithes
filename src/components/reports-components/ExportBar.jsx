import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "./mockData";

export function ExportBar({
  className,
  tab,
  startDate,
  endDate,
  rowCount,
  onDownload,
  downloading,
  downloadError,
}) {
  const disabled = !startDate || !endDate || rowCount === 0 || downloading;

  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Export</CardTitle>
        <CardDescription>
          {!startDate || !endDate
            ? "Select a date range to enable export."
            : rowCount === 0
            ? "No entries in this range to export."
            : `${rowCount} ${tab === "tithes" ? "tithe" : "expense"} entries · ${formatDate(startDate)} to ${formatDate(endDate)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="default"
            disabled={disabled}
            onClick={() => onDownload?.("excel")}
          >
            <FileSpreadsheet className="h-4 w-4" />
            {downloading ? "Exporting…" : "Export Excel"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onDownload?.("pdf")}
          >
            <FileText className="h-4 w-4" />
            {downloading ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
        {downloadError && (
          <p className="text-sm text-red-600">{downloadError}</p>
        )}
      </CardContent>
    </Card>
  );
}
