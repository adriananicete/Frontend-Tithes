import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/admin/categories");
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createCategory = async (payload) => {
    await apiFetch("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refetch();
    notifyAction("categoryCreated");
  };

  // Toast wording branches on payload shape: archive/restore are
  // `isActive`-only PATCHes from Categories.jsx, while a real edit comes
  // from CategoryFormDialog with name/color/etc.
  const updateCategory = async (id, payload) => {
    await apiFetch(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
    const keys = Object.keys(payload);
    if (keys.length === 1 && payload.isActive === false) notifyAction("categoryArchived");
    else if (keys.length === 1 && payload.isActive === true) notifyAction("categoryRestored");
    else notifyAction("categoryUpdated");
  };

  const deleteCategory = async (id) => {
    await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
    await refetch();
    notifyAction("categoryDeleted");
  };

  return {
    categories,
    loading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
