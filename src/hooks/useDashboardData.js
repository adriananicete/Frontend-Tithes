import { useEffect } from "react";
import { apiFetch } from "../services/api";
import { useCachedResource } from "./useCachedResource";

// Role-aware parallel fetch for the Dashboard. Skips endpoints the user
// is not authorized to hit so the page doesn't generate console-noisy 403s.
const canViewExpenses = (role) => ["admin", "auditor"].includes(role);
const canViewVouchers = (role) =>
  ["validator", "do", "auditor", "admin"].includes(role);

export function useDashboardData(role) {
  const showExpenses = canViewExpenses(role);
  const showVouchers = canViewVouchers(role);

  // Cached so returning to the Dashboard is instant; revalidates silently.
  const { data: res, loading, error, refetch } = useCachedResource(
    "dashboard",
    async () => {
      // /expenses/by-category is aggregated (category totals only) and open to
      // every role; the full /expenses + /vouchers lists stay role-gated.
      const [tRes, rRes, eRes, vRes, ecRes] = await Promise.all([
        apiFetch("/tithes"),
        apiFetch("/request-form"),
        showExpenses ? apiFetch("/expenses") : Promise.resolve(null),
        showVouchers ? apiFetch("/vouchers") : Promise.resolve(null),
        apiFetch("/expenses/by-category"),
      ]);
      return {
        tithes: Array.isArray(tRes?.data) ? tRes.data : [],
        tithesChart: Array.isArray(tRes?.chartData) ? tRes.chartData : [],
        rfs: Array.isArray(rRes?.data) ? rRes.data : [],
        expenses: Array.isArray(eRes?.data) ? eRes.data : [],
        vouchers: Array.isArray(vRes?.data) ? vRes.data : [],
        expensesByCategory: Array.isArray(ecRes?.data) ? ecRes.data : [],
      };
    },
    { enabled: !!role },
  );

  // Keep "Your Pending Work" and the stats live without a manual refresh:
  //   1. `notification:new` — dispatched on every realtime socket push.
  //   2. `focus` — reconcile when the user returns to the tab (covers a missed
  //      socket push). Both revalidate silently (no loading skeleton flash).
  useEffect(() => {
    const reload = () => refetch({ silent: true });
    window.addEventListener("notification:new", reload);
    window.addEventListener("focus", reload);
    return () => {
      window.removeEventListener("notification:new", reload);
      window.removeEventListener("focus", reload);
    };
  }, [refetch]);

  return {
    tithes: res?.tithes ?? [],
    tithesChart: res?.tithesChart ?? [],
    expenses: res?.expenses ?? [],
    expensesByCategory: res?.expensesByCategory ?? [],
    rfs: res?.rfs ?? [],
    vouchers: res?.vouchers ?? [],
    loading,
    error,
    refetch,
    canViewExpenses: showExpenses,
    canViewVouchers: showVouchers,
  };
}
