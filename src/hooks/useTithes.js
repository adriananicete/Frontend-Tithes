import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";

export function useTithes() {
  const [tithes, setTithes] = useState([]);
  // chartData is church-wide + anonymized (no submitter identity) so charts
  // and the summary show the whole church's totals to every role, while
  // `tithes` (the table rows) stays role-scoped by the backend.
  const [chartData, setChartData] = useState([]);
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
      setChartData(Array.isArray(res?.chartData) ? res.chartData : []);
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
    notifyAction("tithesSubmitted");
  };

  const approveTithes = async (id) => {
    await apiFetch(`/tithes/${id}/approve`, { method: "PATCH" });
    await refetch();
    notifyAction("tithesApproved");
  };

  const rejectTithes = async (id, rejectionNote) => {
    await apiFetch(`/tithes/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionNote }),
    });
    await refetch();
    notifyAction("tithesRejected");
  };

  const updateTithes = async (id, payload) => {
    await apiFetch(`/tithes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
    notifyAction("tithesUpdated");
  };

  return {
    tithes,
    chartData,
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
