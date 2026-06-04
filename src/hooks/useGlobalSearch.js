import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/services/api";

// Debounced global search against GET /api/search. Returns role-scoped results
// (RF + Voucher) the backend already filtered. Queries < 2 chars return empty
// without hitting the API. A request-id guard drops stale responses so fast
// typing can't render an out-of-order result set.
export function useGlobalSearch(query, { limit = 8, debounceMs = 300 } = {}) {
  const [results, setResults] = useState([]);
  const [counts, setCounts] = useState({ rf: 0, voucher: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const reqId = useRef(0);

  useEffect(() => {
    const q = (query ?? "").trim();
    if (q.length < 2) {
      setResults([]);
      setCounts({ rf: 0, voucher: 0 });
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    const id = ++reqId.current;
    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/search?q=${encodeURIComponent(q)}&limit=${limit}`,
        );
        if (id !== reqId.current) return; // a newer query superseded this one
        setResults(Array.isArray(res?.results) ? res.results : []);
        setCounts(res?.counts ?? { rf: 0, voucher: 0 });
        setError("");
      } catch (err) {
        if (id !== reqId.current) return;
        setError(err.message || "Search failed");
        setResults([]);
        setCounts({ rf: 0, voucher: 0 });
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, limit, debounceMs]);

  return { results, counts, loading, error };
}
