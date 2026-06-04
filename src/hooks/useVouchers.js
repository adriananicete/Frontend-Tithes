import { useEffect } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";
import { useCachedResource } from "./useCachedResource";

export function useVouchers() {
  const { data: res, loading, error, refetch } = useCachedResource(
    "vouchers",
    () => apiFetch("/vouchers"),
  );
  const vouchers = res?.data ?? [];

  useEffect(() => {
    const onNotif = (e) => {
      if (e.detail?.refModel === "Voucher") refetch({ silent: true });
    };
    window.addEventListener("notification:new", onNotif);
    return () => window.removeEventListener("notification:new", onNotif);
  }, [refetch]);

  const createVoucher = async (formData) => {
    const res = await apiFetch("/vouchers", {
      method: "POST",
      body: formData,
    });
    await refetch();
    notifyAction("voucherCreated", res?.data?.pcfNo);
  };

  // Cancelling reopens the linked RF, so broadcast a RequestForm refresh
  // alongside refetching vouchers — keeps any mounted RF page / Dashboard
  // and the PendingRfsCard in sync.
  const cancelVoucher = async (id, cancellationNote) => {
    const res = await apiFetch(`/vouchers/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify(
        cancellationNote ? { cancellationNote } : {},
      ),
    });
    window.dispatchEvent(
      new CustomEvent("notification:new", { detail: { refModel: "RequestForm" } }),
    );
    await refetch();
    notifyAction("voucherCancelled", res?.data?.pcfNo);
  };

  return { vouchers, loading, error, refetch, createVoucher, cancelVoucher };
}
