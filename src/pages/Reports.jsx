import { useState } from "react";
import { Coins, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/reports-components/DateRangePicker";
import { ExportBar } from "@/components/reports-components/ExportBar";
import { ReportPreviewTable } from "@/components/reports-components/ReportPreviewTable";
import { ReportSummary } from "@/components/reports-components/ReportSummary";
import { resolvePreset } from "@/components/reports-components/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useReports } from "@/hooks/useReports";
import { can } from "@/utils/rolePermissions";

function Reports() {
  const { user } = useAuth();
  const canViewExpense = can.viewExpenseReport(user?.role);
  const initial = resolvePreset("this_month");
  const [tab, setTab] = useState("tithes");
  const [startDate, setStartDate] = useState(initial.start);
  const [endDate, setEndDate] = useState(initial.end);
  const [preset, setPreset] = useState("this_month");

  const onRangeChange = ({ startDate: s, endDate: e, preset: p }) => {
    setStartDate(s);
    setEndDate(e);
    setPreset(p);
  };

  const effectiveTab = tab === "expense" && !canViewExpense ? "tithes" : tab;

  const {
    data,
    loading,
    error,
    downloadReport,
    downloading,
    downloadError,
  } = useReports(effectiveTab, startDate, endDate);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Export tithes and expense data for any date range as Excel or PDF.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          preset={preset}
          onChange={onRangeChange}
        />
      </div>

      <div className="shrink-0 flex rounded-md border bg-background p-1 w-fit">
        <Button
          type="button"
          variant={tab === "tithes" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTab("tithes")}
        >
          <Coins className="h-4 w-4" /> Tithes
        </Button>
        {canViewExpense && (
          <Button
            type="button"
            variant={tab === "expense" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("expense")}
          >
            <Receipt className="h-4 w-4" /> Expense
          </Button>
        )}
      </div>

      <div className="shrink-0">
        <ReportSummary tab={effectiveTab} data={data} />
      </div>

      <div className="shrink-0">
        <ExportBar
          tab={effectiveTab}
          startDate={startDate}
          endDate={endDate}
          rowCount={data.length}
          onDownload={downloadReport}
          downloading={downloading}
          downloadError={downloadError}
        />
      </div>

      <div className="h-[24rem] md:h-[32rem] shrink-0">
        <ReportPreviewTable
          tab={effectiveTab}
          data={data}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default Reports;
