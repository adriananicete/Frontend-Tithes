import { useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { CreateVoucherDialog } from "@/components/voucher-components/CreateVoucherDialog";
import { PendingRfsCard } from "@/components/voucher-components/PendingRfsCard";
import { VoucherDetailsDialog } from "@/components/voucher-components/VoucherDetailsDialog";
import { VoucherSummaryStats } from "@/components/voucher-components/VoucherSummaryStats";
import { VoucherTable } from "@/components/voucher-components/VoucherTable";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/utils/rolePermissions";

function Voucher() {
  const { user } = useAuth();
  const canCreate = can.createVoucher(user?.role);
  const [viewingVoucher, setViewingVoucher] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [preselectedRfId, setPreselectedRfId] = useState(null);

  const launchCreate = (rfId = null) => {
    setPreselectedRfId(rfId);
    setCreateOpen(true);
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vouchers</h1>
          <p className="text-sm text-muted-foreground">
            Issue PCF vouchers for approved request forms and track disbursements.
          </p>
        </div>
        {canCreate && (
          <div className="w-40" onClick={() => launchCreate()}>
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
      />

      <div className="shrink-0">
        <VoucherSummaryStats />
      </div>

      {canCreate && (
        <div className="shrink-0">
          <PendingRfsCard onCreateVoucher={launchCreate} />
        </div>
      )}

      <div className="h-[32rem] shrink-0">
        <VoucherTable onViewVoucher={setViewingVoucher} />
      </div>

      <VoucherDetailsDialog
        voucher={viewingVoucher}
        open={!!viewingVoucher}
        onOpenChange={(v) => !v && setViewingVoucher(null)}
      />
    </div>
  );
}

export default Voucher;
