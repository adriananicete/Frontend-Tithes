import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/expenses");
      setExpenses(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createExpense = async (payload) => {
    await apiFetch("/expenses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refetch();
  };

  return { expenses, loading, error, refetch, createExpense };
}
