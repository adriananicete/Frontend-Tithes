import { ServiceTypeBreakdown } from "@/components/tithes-components/ServiceTypeBreakdown";
import { SubmitTithesDialog } from "@/components/tithes-components/SubmitTithesDialog";
import { TithesSummary } from "@/components/tithes-components/TithesSummary";
import { TithesTable } from "@/components/tithes-components/TithesTable";
import { TithesTrendChart } from "@/components/tithes-components/TithesTrendChart";

function Tithes() {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tithes</h1>
          <p className="text-sm text-muted-foreground">
            Track, review, and manage all tithes submissions.
          </p>
        </div>
        <SubmitTithesDialog />
      </div>

      <div className="h-96">
        <TithesTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TithesSummary />
        <div className="h-80">
          <ServiceTypeBreakdown />
        </div>
      </div>

      <div className="h-[32rem]">
        <TithesTable />
      </div>
    </div>
  );
}

export default Tithes;
