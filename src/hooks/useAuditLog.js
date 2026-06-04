import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

const LIMIT = 20;

// Server-paginated audit log reader (admin/auditor). Refetches when the page
// or filters change. A stale-guard drops out-of-order responses.
export function useAuditLog() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ targetModel: "", action: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
        if (filters.targetModel) params.set("targetModel", filters.targetModel);
        if (filters.action) params.set("action", filters.action);
        const res = await apiFetch(`/audit-log?${params.toString()}`);
        if (!active) return;
        setData(Array.isArray(res?.data) ? res.data : []);
        setTotal(res?.total ?? 0);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load audit log");
        setData([]);
        setTotal(0);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, filters]);

  // Changing a filter resets to page 1.
  const setFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  return { data, total, page, limit: LIMIT, setPage, filters, setFilter, loading, error };
}
