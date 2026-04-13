import { useState } from "react";
import { CreateRfDialog } from "@/components/request-form-components/CreateRfDialog";
import { RfDetailsDialog } from "@/components/request-form-components/RfDetailsDialog";
import { RfPipelineTracker } from "@/components/request-form-components/RfPipelineTracker";
import { RfSummaryStats } from "@/components/request-form-components/RfSummaryStats";
import { RfTable } from "@/components/request-form-components/RfTable";

function RequestForm() {
  const [activeStatus, setActiveStatus] = useState(null);
  const [viewingRf, setViewingRf] = useState(null);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Request Forms</h1>
          <p className="text-sm text-muted-foreground">
            Create, track, and approve request forms through the pipeline.
          </p>
        </div>
        <CreateRfDialog />
      </div>

      <RfPipelineTracker
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
      />

      <RfSummaryStats />

      <div className="h-[32rem]">
        <RfTable
          statusFilter={activeStatus}
          onClearStatusFilter={() => setActiveStatus(null)}
          onViewRf={setViewingRf}
        />
      </div>

      <RfDetailsDialog
        rf={viewingRf}
        open={!!viewingRf}
        onOpenChange={(v) => !v && setViewingRf(null)}
      />
    </div>
  );
}

export default RequestForm;
