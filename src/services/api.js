const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7001/api";

export async function apiFetch(path, options = {}) {
  const { responseType, ...fetchOptions } = options;
  const token = localStorage.getItem("token");
  const isFormData = fetchOptions.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(fetchOptions.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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
