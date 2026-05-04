import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { CreateRfDialog } from "@/components/request-form-components/CreateRfDialog";
import { RejectDialog } from "@/components/request-form-components/RejectDialog";
import { RfDetailsDialog } from "@/components/request-form-components/RfDetailsDialog";
import { RfPipelineTracker } from "@/components/request-form-components/RfPipelineTracker";
import { RfSummaryStats } from "@/components/request-form-components/RfSummaryStats";
import { RfTable } from "@/components/request-form-components/RfTable";
import { useAuth } from "@/hooks/useAuth";
import { useRequestForms } from "@/hooks/useRequestForms";
import { useCategories } from "@/hooks/useCategories";
import { useTithes } from "@/hooks/useTithes";

// Confirm-dialog copy keyed by action kind. Mirrors the per-action wording
// already used in PendingWorkSection so the same RF action reads the same
// way wherever it can be triggered (dropdown menu, details footer, dashboard).
const RF_CONFIRM_CONFIG = {
  submit: {
    variant: "approve",
    title: "Submit for validation?",
    describe: (rf) => `${rf.rfNo} will be sent to the validator. You can no longer edit it after submitting.`,
    confirmLabel: "Yes, submit",
    pendingLabel: "Submitting…",
  },
  delete: {
    variant: "delete",
    title: "Delete this request form?",
    describe: (rf) => `${rf.rfNo} will be permanently removed. This cannot be undone.`,
    confirmLabel: "Yes, delete",
    pendingLabel: "Deleting…",
  },
  validate: {
    variant: "approve",
    title: "Validate this request form?",
    describe: (rf) => `${rf.rfNo} will move to the approval stage.`,
    confirmLabel: "Yes, validate",
    pendingLabel: "Validating…",
  },
  approve: {
    variant: "approve",
    title: "Approve this request form?",
    describe: (rf) => `${rf.rfNo} will be marked approved and ready for voucher creation.`,
    confirmLabel: "Yes, approve",
    pendingLabel: "Approving…",
  },
  disburse: {
    variant: "approve",
    title: "Mark as disbursed?",
    describe: (rf) => `${rf.rfNo} will be marked as disbursed. The requester will be notified to confirm receipt.`,
    confirmLabel: "Yes, disbursed",
    pendingLabel: "Marking…",
  },
  received: {
    variant: "approve",
    title: "Confirm receipt?",
    describe: (rf) => `${rf.rfNo} will be marked as received and closed.`,
    confirmLabel: "Yes, received",
    pendingLabel: "Confirming…",
  },
};

function RequestForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState(null);
  const [viewingRf, setViewingRf] = useState(null);
  // Action dialog states lifted from RfTable — both the dropdown menu in
  // the table and the new footer buttons in RfDetailsDialog dispatch into
  // these via the shared `requestRfAction` helper below.
  const [editingRf, setEditingRf] = useState(null);
  const [rejectingRf, setRejectingRf] = useState(null);
  const [confirmingRf, setConfirmingRf] = useState(null); // { rf, kind } | null
  const [searchParams, setSearchParams] = useSearchParams();
  const focusId = searchParams.get("focus");

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
    disburseRf,
    markRfReceived,
  } = useRequestForms();

  const { categories } = useCategories();
  // Mount useTithes only to read the church's available cash-on-hand
  // (approved tithes − all expenses). Used to gate the RF estimatedAmount
  // input so members can't request more than the church actually has.
  const { availableBalance } = useTithes();

  useEffect(() => {
    if (!focusId || !rfs.length) return;
    const match = rfs.find((rf) => rf._id === focusId);
    if (match) setViewingRf(match);
  }, [focusId, rfs]);

  const closeViewing = () => {
    setViewingRf(null);
    if (focusId) {
      const params = new URLSearchParams(searchParams);
      params.delete("focus");
      setSearchParams(params, { replace: true });
    }
  };

  const handleViewClose = (next) => {
    if (!next) closeViewing();
  };

  // Single dispatch entrypoint for every RF action. Both the table's
  // dropdown menu and the details dialog's footer buttons call this — it
  // closes the details view first (so we never stack two modals) then
  // opens the right secondary dialog. `kind` matches RF_CONFIRM_CONFIG
  // keys, plus three special kinds: edit, reject, createVoucher.
  const requestRfAction = (kind, rf) => {
    closeViewing();
    if (kind === "edit") setEditingRf(rf);
    else if (kind === "reject") setRejectingRf(rf);
    else if (kind === "createVoucher") navigate("/voucher");
    else setConfirmingRf({ rf, kind });
  };

  const handleConfirmRfAction = async () => {
    if (!confirmingRf) return;
    const { rf, kind } = confirmingRf;
    const id = rf._id;
    if (kind === "submit") return submitRf?.(id);
    if (kind === "delete") return deleteRf?.(id);
    if (kind === "validate") return validateRf?.(id);
    if (kind === "approve") return approveRf?.(id);
    if (kind === "disburse") return disburseRf?.(id);
    if (kind === "received") return markRfReceived?.(id);
  };

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
          availableBalance={availableBalance}
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
          onRequestAction={requestRfAction}
        />
      </div>

      <RfDetailsDialog
        rf={viewingRf}
        open={!!viewingRf}
        onOpenChange={handleViewClose}
        userRole={user?.role}
        currentUserId={user?.id}
        onRequestAction={requestRfAction}
      />

      {editingRf && (
        <CreateRfDialog
          categories={rfCategories}
          editingRf={editingRf}
          onUpdate={updateRf}
          open={!!editingRf}
          onOpenChange={(v) => !v && setEditingRf(null)}
        />
      )}

      <RejectDialog
        rf={rejectingRf}
        open={!!rejectingRf}
        onOpenChange={(v) => !v && setRejectingRf(null)}
        onConfirm={async (note) => {
          await rejectRf?.(rejectingRf._id, note);
        }}
      />

      {confirmingRf && (() => {
        const cfg = RF_CONFIRM_CONFIG[confirmingRf.kind];
        if (!cfg) return null;
        return (
          <ConfirmActionDialog
            open={!!confirmingRf}
            onOpenChange={(v) => !v && setConfirmingRf(null)}
            variant={cfg.variant}
            title={cfg.title}
            description={cfg.describe(confirmingRf.rf)}
            confirmLabel={cfg.confirmLabel}
            pendingLabel={cfg.pendingLabel}
            onConfirm={handleConfirmRfAction}
          />
        );
      })()}
    </div>
  );
}

export default RequestForm;
