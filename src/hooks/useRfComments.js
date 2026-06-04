import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

// Comment thread for a single Request Form. Fetches only while `enabled`
// (the details dialog is open) so closed rows don't hit the API.
export function useRfComments(rfId, enabled) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  const refetch = useCallback(async () => {
    if (!rfId) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`/request-form/${rfId}/comments`);
      setComments(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [rfId]);

  useEffect(() => {
    if (enabled && rfId) refetch();
    else setComments([]);
  }, [enabled, rfId, refetch]);

  const addComment = async (text) => {
    const trimmed = (text ?? "").trim();
    if (!trimmed) return;
    setPosting(true);
    try {
      await apiFetch(`/request-form/${rfId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: trimmed }),
      });
      await refetch();
    } finally {
      setPosting(false);
    }
  };

  return { comments, loading, error, posting, addComment, refetch };
}
