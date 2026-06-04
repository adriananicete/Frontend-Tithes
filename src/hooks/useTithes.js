import { useEffect } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";
import { useCachedResource } from "./useCachedResource";

export function useTithes() {
  // Cached so navigating back to the Tithes page is instant; revalidates
  // silently in the background. `chartData` is church-wide + anonymized.
  const { data: res, loading, error, refetch } = useCachedResource(
    "tithes",
    () => apiFetch("/tithes"),
  );

  const tithes = res?.data ?? [];
  const chartData = res?.chartData ?? [];
  const totalBalance = res?.totalBalance ?? 0;
  const availableBalance = res?.availableBalance ?? 0;

  useEffect(() => {
    const onNotif = (e) => {
      if (e.detail?.refModel === "Tithes") refetch({ silent: true });
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
