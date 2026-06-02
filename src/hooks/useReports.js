import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";

export function useReports(tab, startDate, endDate, enabled = true) {
  const [data, setData] = useState([]);
  // Combined report returns { summary, tithes, expenses } instead of { data };
  // `summary` is null for the single-entity (tithes/expense) tabs.
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const refetch = useCallback(async () => {
    if (!enabled || !startDate || !endDate) {
      setData([]);
      setSummary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const qs = `?startDate=${startDate}&endDate=${endDate}`;
      const res = await apiFetch(`/reports/${tab}${qs}`);
      if (res?.summary) {
        setSummary(res.summary);
        setData([]);
      } else {
        setSummary(null);
        setData(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      setError(err.message || `Failed to load ${tab} report`);
      setData([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [tab, startDate, endDate, enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const downloadReport = async (format) => {
    setDownloading(true);
    setDownloadError("");
    try {
      const qs = `?startDate=${startDate}&endDate=${endDate}`;
      const blob = await apiFetch(`/reports/${tab}/export/${format}${qs}`, {
        responseType: "blob",
      });
      const ext = format === "excel" ? "xlsx" : "pdf";
      const base = tab === "combined" ? "financial-summary-report" : `${tab}-report`;
      const filename = `${base}.${ext}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notifyAction("reportExported");
    } catch (err) {
      setDownloadError(err.message || `Failed to export ${format.toUpperCase()}`);
    } finally {
      setDownloading(false);
    }
  };

  return {
    data,
    summary,
    loading,
    error,
    refetch,
    downloadReport,
    downloading,
    downloadError,
  };
}
