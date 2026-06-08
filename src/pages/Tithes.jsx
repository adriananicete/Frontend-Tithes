import { useSearchParams } from "react-router";
import { ServiceTypeBreakdown } from "@/components/tithes-components/ServiceTypeBreakdown";
import { SubmitTithesDialog } from "@/components/tithes-components/SubmitTithesDialog";
import { TithesSummary } from "@/components/tithes-components/TithesSummary";
import { TithesTable } from "@/components/tithes-components/TithesTable";
import { TithesTrendChart } from "@/components/tithes-components/TithesTrendChart";
import { useTithes } from "@/hooks/useTithes";

function Tithes() {
  const {
    tithes,
    chartData,
    loading,
    error,
    submitTithes,
    approveTithes,
    rejectTithes,
  } = useTithes();

  const [searchParams, setSearchParams] = useSearchParams();
  const focusId = searchParams.get("focus");

  const clearFocus = () => {
    if (!focusId) return;
    const params = new URLSearchParams(searchParams);
    params.delete("focus");
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Tithes</h1>
          <p className="text-sm text-muted-foreground">
            Track, review, and manage all tithes submissions.
          </p>
        </div>
        <SubmitTithesDialog onSubmit={submitTithes} />
      </div>

      {/* Charts/summary use the church-wide `chartData` so every role sees the
          whole church's totals; the table below stays role-scoped. */}
      <div className="h-72 md:h-96">
        <TithesTrendChart tithes={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TithesSummary tithes={chartData} />
        <div className="h-72 md:h-80">
          <ServiceTypeBreakdown tithes={chartData} />
        </div>
      </div>

      <div className="h-[24rem] md:h-[32rem]">
        <TithesTable
          tithes={tithes}
          loading={loading}
          error={error}
          onApprove={approveTithes}
          onReject={rejectTithes}
          focusId={focusId}
          onFocusHandled={clearFocus}
        />
      </div>
    </div>
  );
}

export default Tithes;
