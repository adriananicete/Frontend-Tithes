const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7001/api";

// Single-flight token refresh: if several requests 401 at once, they all await
// the same /auth/refresh call instead of stampeding the endpoint.
let refreshPromise = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((r) => r.ok)
      .catch(() => false);
    refreshPromise.finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function endSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function apiFetch(path, options = {}) {
  const { responseType, _retry, ...fetchOptions } = options;
  // Legacy/dev fallback only — prod auth rides the httpOnly cookie.
  const token = localStorage.getItem("token");
  const isFormData = fetchOptions.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(fetchOptions.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    // Try one silent refresh, then replay the original request once. Skip for
    // /auth/* calls (login/refresh/logout) to avoid loops.
    const isAuthCall = path.startsWith("/auth/");
    if (!_retry && !isAuthCall) {
      const refreshed = await refreshSession();
      if (refreshed) {
        return apiFetch(path, { ...options, _retry: true });
      }
    }
    endSession();
    return Promise.reject(new Error("Unauthorized"));
  }

  const contentType = res.headers.get("content-type") || "";

  if (responseType === "blob") {
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const message = (data && (data.message || data.error)) || "No data to export";
      return Promise.reject(new Error(message));
    }
    if (!res.ok) {
      const text = await res.text();
      return Promise.reject(new Error(text || res.statusText || "Export failed"));
    }
    return res.blob();
  }

  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || "Request failed";
    return Promise.reject(new Error(message));
  }

  return data;
}
