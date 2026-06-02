import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";

export function useVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/vouchers");
      setVouchers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const onNotif = (e) => {
      if (e.detail?.refModel === "Voucher") refetch();
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
