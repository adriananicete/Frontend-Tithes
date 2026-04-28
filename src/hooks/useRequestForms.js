import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useRequestForms() {
  const [rfs, setRfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/request-form");
      setRfs(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load request forms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const onNotif = (e) => {
      if (e.detail?.refModel === "RequestForm") refetch();
    };
    window.addEventListener("notification:new", onNotif);
    return () => window.removeEventListener("notification:new", onNotif);
  }, [refetch]);

  const createRf = async (payload) => {
    const res = await apiFetch("/request-form", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refetch();
    return res?.data;
  };

  // Create a draft and immediately submit it for validation.
  // Two backend calls + one refetch, so the table only flickers once.
  const createAndSubmitRf = async (payload) => {
    const created = await apiFetch("/request-form", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const newId = created?.data?._id;
    if (newId) {
      await apiFetch(`/request-form/${newId}/submit`, { method: "PATCH" });
    }
    await refetch();
  };

  const updateRf = async (id, payload) => {
    await apiFetch(`/request-form/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
  };

  const deleteRf = async (id) => {
    await apiFetch(`/request-form/${id}`, { method: "DELETE" });
    await refetch();
  };

  const submitRf = async (id) => {
    await apiFetch(`/request-form/${id}/submit`, { method: "PATCH" });
    await refetch();
  };

  const validateRf = async (id) => {
    await apiFetch(`/request-form/${id}/validate`, { method: "PATCH" });
    await refetch();
  };

  const approveRf = async (id) => {
    await apiFetch(`/request-form/${id}/approve`, { method: "PATCH" });
    await refetch();
  };

  const rejectRf = async (id, rejectionNote) => {
    await apiFetch(`/request-form/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionNote }),
    });
    await refetch();
  };

  const disburseRf = async (id) => {
    await apiFetch(`/request-form/${id}/disburse`, { method: "PATCH" });
    await refetch();
  };

  const markRfReceived = async (id) => {
    await apiFetch(`/request-form/${id}/received`, { method: "PATCH" });
    await refetch();
  };

  return {
    rfs,
    loading,
    error,
    refetch,
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
  };
}
