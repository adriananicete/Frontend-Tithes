import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

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

  const createVoucher = async (formData) => {
    await apiFetch("/vouchers", {
      method: "POST",
      body: formData,
    });
    await refetch();
  };

  return { vouchers, loading, error, refetch, createVoucher };
}
