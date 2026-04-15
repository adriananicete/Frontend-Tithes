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

export function ExportBar({ className, tab, startDate, endDate, rowCount }) {
  const disabled = !startDate || !endDate || rowCount === 0;

  const handleExport = (format) => {
    // TODO: GET /api/reports/<tab>/export/<format>?startDate=...&endDate=...
    //   For PDF: responseType: 'blob', then URL.createObjectURL + link.click (see §10)
    const endpoint = `/api/reports/${tab}/export/${format}?startDate=${startDate}&endDate=${endDate}`;
    console.log(`Export ${format.toUpperCase()} (mock):`, endpoint);
  };

  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Export</CardTitle>
        <CardDescription>
          {disabled
            ? "Select a date range with at least one entry to enable export."
            : `${rowCount} ${tab === "tithes" ? "tithe" : "expense"} entries · ${formatDate(startDate)} to ${formatDate(endDate)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="default"
          disabled={disabled}
          onClick={() => handleExport("excel")}
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Excel
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => handleExport("pdf")}
        >
          <FileText className="h-4 w-4" /> Export PDF
        </Button>
      </CardContent>
    </Card>
  );
}
