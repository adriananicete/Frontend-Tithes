import { useCallback, useEffect, useRef, useState } from "react";

// Module-level SWR-style cache: key -> last successful data. It survives route
// changes (the page data hooks unmount/remount on navigation), so revisiting a
// page renders instantly from cache while a silent refetch keeps it fresh.
//
// Cleared on login/logout (see AuthContext) so a new user never sees the
// previous user's role-scoped data.
const cache = new Map();

export function clearResourceCache() {
  cache.clear();
}

// useCachedResource(key, fetcher, { enabled })
//   - data/loading seed from cache: loading is true ONLY on the first-ever load
//   - on mount with cache: render cached + revalidate silently (no spinner)
//   - on mount without cache: normal load with spinner
//   - silent failures keep the cached data (no blocking error)
export function useCachedResource(key, fetcher, { enabled = true } = {}) {
  const [data, setData] = useState(() => (cache.has(key) ? cache.get(key) : undefined));
  const [loading, setLoading] = useState(() => enabled && !cache.has(key));
  const [error, setError] = useState("");

  // Hold the latest fetcher without making it a hook dependency — callers pass
  // a fresh inline closure each render, so depending on it would loop forever.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(
    async ({ silent = false } = {}) => {
      if (!enabled) return;
      if (!silent && !cache.has(key)) setLoading(true);
      try {
        const result = await fetcherRef.current();
        cache.set(key, result);
        setData(result);
        setError("");
      } catch (err) {
        // Keep showing cached data on a background/silent failure.
        if (!cache.has(key)) setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    [key, enabled],
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    if (cache.has(key)) {
      setData(cache.get(key));
      setLoading(false);
      refetch({ silent: true });
    } else {
      refetch({ silent: false });
    }
  }, [key, enabled, refetch]);

  return { data, loading, error, refetch };
}
