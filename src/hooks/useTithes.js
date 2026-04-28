import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useTithes() {
  const [tithes, setTithes] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/tithes");
      setTithes(Array.isArray(res?.data) ? res.data : []);
      setTotalBalance(res?.totalBalance ?? 0);
      setAvailableBalance(res?.availableBalance ?? 0);
    } catch (err) {
      setError(err.message || "Failed to load tithes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const onNotif = (e) => {
      if (e.detail?.refModel === "Tithes") refetch();
    };
    window.addEventListener("notification:new", onNotif);
    return () => window.removeEventListener("notification:new", onNotif);
  }, [refetch]);

  const submitTithes = async (payload) => {
    await apiFetch("/tithes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refetch();
  };

  const approveTithes = async (id) => {
    await apiFetch(`/tithes/${id}/approve`, { method: "PATCH" });
    await refetch();
  };

  const rejectTithes = async (id, rejectionNote) => {
    await apiFetch(`/tithes/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionNote }),
    });
    await refetch();
  };

  const updateTithes = async (id, payload) => {
    await apiFetch(`/tithes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
  };

  return {
    tithes,
    totalBalance,
    availableBalance,
    loading,
    error,
    refetch,
    submitTithes,
    approveTithes,
    rejectTithes,
    updateTithes,
  };
}
