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
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [rfs, setRfs] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // `silent` skips the loading state so a realtime refresh doesn't flash
  // skeletons over already-rendered data — used by the notification listener.
  const load = useCallback(async (silent = false) => {
    if (!role) return;
    if (!silent) setLoading(true);
    setError("");

    const showExpenses = canViewExpenses(role);
    const showVouchers = canViewVouchers(role);

    try {
      // /expenses/by-category is aggregated (category totals only) and is
      // open to every role, so it's fetched unconditionally — unlike the
      // full /expenses list which stays admin/auditor-gated.
      const [tRes, rRes, eRes, vRes, ecRes] = await Promise.all([
        apiFetch("/tithes"),
        apiFetch("/request-form"),
        showExpenses ? apiFetch("/expenses") : Promise.resolve(null),
        showVouchers ? apiFetch("/vouchers") : Promise.resolve(null),
        apiFetch("/expenses/by-category"),
      ]);
      setTithes(Array.isArray(tRes?.data) ? tRes.data : []);
      setRfs(Array.isArray(rRes?.data) ? rRes.data : []);
      setExpenses(Array.isArray(eRes?.data) ? eRes.data : []);
      setVouchers(Array.isArray(vRes?.data) ? vRes.data : []);
      setExpensesByCategory(Array.isArray(ecRes?.data) ? ecRes.data : []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [role]);

  const refetch = useCallback(() => load(false), [load]);

  useEffect(() => {
    load(false);
  }, [load]);

  // Realtime: NotificationsContext dispatches a window `notification:new`
  // on every socket push. Silently refetch so "Your Pending Work" and the
  // stats stay live without a manual refresh — same broadcast the resource
  // hooks (useVouchers / useRequestForms / useTithes) already listen to.
  useEffect(() => {
    const onNotif = () => load(true);
    window.addEventListener("notification:new", onNotif);
    return () => window.removeEventListener("notification:new", onNotif);
  }, [load]);

  return {
    tithes,
    expenses,
    expensesByCategory,
    rfs,
    vouchers,
    loading,
    error,
    refetch,
    canViewExpenses: canViewExpenses(role),
    canViewVouchers: canViewVouchers(role),
  };
}
