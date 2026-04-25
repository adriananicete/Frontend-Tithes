import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

// Role-aware parallel fetch for the Dashboard. Skips endpoints the user
// is not authorized to hit so the page doesn't generate console-noisy 403s.
const canViewExpenses = (role) => ["admin", "auditor"].includes(role);
const canViewVouchers = (role) =>
  ["validator", "do", "auditor", "admin"].includes(role);

export function useDashboardData(role) {
  const [tithes, setTithes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [rfs, setRfs] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    setError("");

    const showExpenses = canViewExpenses(role);
    const showVouchers = canViewVouchers(role);

    try {
      const [tRes, rRes, eRes, vRes] = await Promise.all([
        apiFetch("/tithes"),
        apiFetch("/request-form"),
        showExpenses ? apiFetch("/expenses") : Promise.resolve(null),
        showVouchers ? apiFetch("/vouchers") : Promise.resolve(null),
      ]);
      setTithes(Array.isArray(tRes?.data) ? tRes.data : []);
      setRfs(Array.isArray(rRes?.data) ? rRes.data : []);
      setExpenses(Array.isArray(eRes?.data) ? eRes.data : []);
      setVouchers(Array.isArray(vRes?.data) ? vRes.data : []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    tithes,
    expenses,
    rfs,
    vouchers,
    loading,
    error,
    refetch,
    canViewExpenses: canViewExpenses(role),
    canViewVouchers: canViewVouchers(role),
  };
}
