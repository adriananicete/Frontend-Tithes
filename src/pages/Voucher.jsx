import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { CreateVoucherDialog } from "@/components/voucher-components/CreateVoucherDialog";
import { PendingRfsCard } from "@/components/voucher-components/PendingRfsCard";
import { VoucherDetailsDialog } from "@/components/voucher-components/VoucherDetailsDialog";
import { VoucherSummaryStats } from "@/components/voucher-components/VoucherSummaryStats";
import { VoucherTable } from "@/components/voucher-components/VoucherTable";
import { useAuth } from "@/hooks/useAuth";
import { useRequestForms } from "@/hooks/useRequestForms";
import { useVouchers } from "@/hooks/useVouchers";
import { apiFetch } from "@/services/api";
import { can } from "@/utils/rolePermissions";

// Confirm-dialog copy keyed by action kind. Both actions on the voucher
// page mutate the linked RF — disburse and markReceived — so the wording
// matches the RF page versions verbatim for consistency.
const VOUCHER_CONFIRM_CONFIG = {
  disburse: {
    variant: "approve",
    title: "Mark as disbursed?",
    describe: (v) =>
      `${v.rfId?.rfNo ?? "This RF"} will be marked as disbursed. The requester will be notified to confirm receipt.`,
    confirmLabel: "Yes, disbursed",
    pendingLabel: "Marking…",
    endpoint: (v) => `/request-form/${v.rfId?._id}/disburse`,
  },
  markReceived: {
    variant: "approve",
    title: "Confirm receipt?",
    describe: (v) => `${v.rfId?.rfNo ?? "This RF"} will be marked as received and closed.`,
    confirmLabel: "Yes, received",
    pendingLabel: "Confirming…",
    endpoint: (v) => `/request-form/${v.rfId?._id}/received`,
  },
};

function Voucher() {
  const { user } = useAuth();
  const canCreate = can.createVoucher(user?.role);
  const [viewingVoucher, setViewingVoucher] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [preselectedRfId, setPreselectedRfId] = useState(null);
  // confirming = { voucher, kind } | null. Both VoucherTable's dropdown
  // and VoucherDetailsDialog's footer dispatch into this via the shared
  // requestVoucherAction helper.
  const [confirming, setConfirming] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const focusId = searchParams.get("focus");

  const { vouchers, loading, error, refetch, createVoucher } = useVouchers();
  // Approved-but-no-voucher list feeds the PendingRfsCard. The hook
  // refetches itself on `notification:new` events with refModel=RequestForm,
  // so this stays in sync after disburse / received / new approvals.
  const {
    rfs: allRfs,
    loading: rfsLoading,
    error: rfsError,
  } = useRequestForms();
  const pendingApprovedRfs = useMemo(
    () => allRfs.filter((rf) => rf.status === "approved" && !rf.voucherId),
    [allRfs],
  );

  useEffect(() => {
    if (!focusId || !vouchers.length) return;
    const match = vouchers.find((v) => v._id === focusId);
    if (match) setViewingVoucher(match);
  }, [focusId, vouchers]);

  const closeViewing = () => {
    setViewingVoucher(null);
    if (focusId) {
      const params = new URLSearchParams(searchParams);
      params.delete("focus");
      setSearchParams(params, { replace: true });
    }
  };

  const handleViewClose = (next) => {
    if (!next) closeViewing();
  };

  const launchCreate = (rfId = null) => {
    setPreselectedRfId(rfId);
    setCreateOpen(true);
  };

  // Single dispatcher for every voucher-row action. Both surfaces (table
  // dropdown + details footer) call this — closes the details view first
  // so the confirm never stacks on top of two modals.
  const requestVoucherAction = (kind, voucher) => {
    closeViewing();
    setConfirming({ voucher, kind });
  };

  const handleConfirmVoucherAction = async () => {
    if (!confirming) return;
    const cfg = VOUCHER_CONFIRM_CONFIG[confirming.kind];
    if (!cfg) return;
    const path = cfg.endpoint(confirming.voucher);
    await apiFetch(path, { method: "PATCH" });
    // Both actions mutate an RF — broadcast so any mounted RF page or
    // Dashboard refetches in lockstep, then refetch vouchers so the
    // status badge on the row flips.
    window.dispatchEvent(
      new CustomEvent("notification:new", { detail: { refModel: "RequestForm" } }),
    );
    await refetch();
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Vouchers</h1>
          <p className="text-sm text-muted-foreground">
            Issue PCF vouchers for approved request forms and track disbursements.
          </p>
        </div>
        {canCreate && (
          <div className="w-full sm:w-40" onClick={() => launchCreate()}>
            <CustomButton titleName="Create Voucher" icon={GoPlus} />
          </div>
        )}
      </div>

      <CreateVoucherDialog
        open={createOpen}
        onOpenChange={(v) => {
          setCreateOpen(v);
          if (!v) setPreselectedRfId(null);
        }}
        preselectedRfId={preselectedRfId}
        onSubmit={createVoucher}
      />

      <div className="shrink-0">
        <VoucherSummaryStats vouchers={vouchers} />
      </div>

      {canCreate && (
        <div className="shrink-0">
          <PendingRfsCard
            rfs={pendingApprovedRfs}
            loading={rfsLoading}
            error={rfsError}
            onCreateVoucher={launchCreate}
          />
        </div>
      )}

      <div className="h-[24rem] md:h-[32rem] shrink-0">
        <VoucherTable
          vouchers={vouchers}
          loading={loading}
          error={error}
          onViewVoucher={setViewingVoucher}
          userRole={user?.role}
          currentUserId={user?.id}
          onRequestAction={requestVoucherAction}
        />
      </div>

      <VoucherDetailsDialog
        voucher={viewingVoucher}
        open={!!viewingVoucher}
        onOpenChange={handleViewClose}
        userRole={user?.role}
        currentUserId={user?.id}
        onRequestAction={requestVoucherAction}
      />

      {confirming && (() => {
        const cfg = VOUCHER_CONFIRM_CONFIG[confirming.kind];
        if (!cfg) return null;
        return (
          <ConfirmActionDialog
            open={!!confirming}
            onOpenChange={(v) => !v && setConfirming(null)}
            variant={cfg.variant}
            title={cfg.title}
            description={cfg.describe(confirming.voucher)}
            confirmLabel={cfg.confirmLabel}
            pendingLabel={cfg.pendingLabel}
            onConfirm={handleConfirmVoucherAction}
          />
        );
      })()}
    </div>
  );
}

export default Voucher;
