import { useEffect } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";
import { useCachedResource } from "./useCachedResource";

export function useRequestForms() {
  const { data: res, loading, error, refetch } = useCachedResource(
    "requestForms",
    () => apiFetch("/request-form"),
  );
  const rfs = res?.data ?? [];

  useEffect(() => {
    const onNotif = (e) => {
      if (e.detail?.refModel === "RequestForm") refetch({ silent: true });
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
    notifyAction("rfDraftCreated", res?.data?.rfNo);
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
    notifyAction("rfSubmitted", created?.data?.rfNo);
  };

  const updateRf = async (id, payload) => {
    await apiFetch(`/request-form/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
    notifyAction("rfDraftUpdated");
  };

  const deleteRf = async (id) => {
    await apiFetch(`/request-form/${id}`, { method: "DELETE" });
    await refetch();
    notifyAction("rfDraftDeleted");
  };

  const submitRf = async (id) => {
    await apiFetch(`/request-form/${id}/submit`, { method: "PATCH" });
    await refetch();
    notifyAction("rfSubmitted");
  };

  const validateRf = async (id) => {
    await apiFetch(`/request-form/${id}/validate`, { method: "PATCH" });
    await refetch();
    notifyAction("rfValidated");
  };

  const approveRf = async (id) => {
    await apiFetch(`/request-form/${id}/approve`, { method: "PATCH" });
    await refetch();
    notifyAction("rfApproved");
  };

  const rejectRf = async (id, rejectionNote) => {
    await apiFetch(`/request-form/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionNote }),
    });
    await refetch();
    notifyAction("rfRejected");
  };

  const disburseRf = async (id) => {
    await apiFetch(`/request-form/${id}/disburse`, { method: "PATCH" });
    await refetch();
    notifyAction("rfDisbursed");
  };

  const markRfReceived = async (id) => {
    await apiFetch(`/request-form/${id}/received`, { method: "PATCH" });
    await refetch();
    notifyAction("rfReceived");
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
