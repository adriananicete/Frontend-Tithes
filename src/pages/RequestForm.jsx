import { useMemo, useState } from "react";
import { CreateRfDialog } from "@/components/request-form-components/CreateRfDialog";
import { RfDetailsDialog } from "@/components/request-form-components/RfDetailsDialog";
import { RfPipelineTracker } from "@/components/request-form-components/RfPipelineTracker";
import { RfSummaryStats } from "@/components/request-form-components/RfSummaryStats";
import { RfTable } from "@/components/request-form-components/RfTable";
import { useRequestForms } from "@/hooks/useRequestForms";
import { useCategories } from "@/hooks/useCategories";

function RequestForm() {
  const [activeStatus, setActiveStatus] = useState(null);
  const [viewingRf, setViewingRf] = useState(null);

  const {
    rfs,
    loading,
    error,
    createRf,
    createAndSubmitRf,
    updateRf,
    deleteRf,
    submitRf,
    validateRf,
    approveRf,
    rejectRf,
    markRfReceived,
  } = useRequestForms();

  const { categories } = useCategories();

  const rfCategories = useMemo(
    () => categories.filter((c) => c.type === "rf" && c.isActive !== false),
    [categories],
  );

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Request Forms</h1>
          <p className="text-sm text-muted-foreground">
            Create, track, and approve request forms through the pipeline.
          </p>
        </div>
        <CreateRfDialog
          categories={rfCategories}
          onCreateDraft={createRf}
          onCreateAndSubmit={createAndSubmitRf}
        />
      </div>

      <div className="shrink-0">
        <RfPipelineTracker
          rfs={rfs}
          activeStatus={activeStatus}
          onSelectStatus={setActiveStatus}
        />
      </div>

      <div className="shrink-0">
        <RfSummaryStats rfs={rfs} />
      </div>

      <div className="h-[24rem] md:h-[32rem] shrink-0">
        <RfTable
          rfs={rfs}
          loading={loading}
          error={error}
          categories={rfCategories}
          statusFilter={activeStatus}
          onClearStatusFilter={() => setActiveStatus(null)}
          onViewRf={setViewingRf}
          onUpdateRf={updateRf}
          onDeleteRf={deleteRf}
          onSubmitRf={submitRf}
          onValidateRf={validateRf}
          onApproveRf={approveRf}
          onRejectRf={rejectRf}
          onMarkReceived={markRfReceived}
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
