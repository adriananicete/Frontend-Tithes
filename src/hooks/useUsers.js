import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/admin/users");
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createUser = async (payload) => {
    await apiFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refetch();
  };

  const updateUser = async (id, payload) => {
    await apiFetch(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
  };

  const deactivateUser = async (id) => {
    await apiFetch(`/admin/users/${id}/deactivate`, { method: "PATCH" });
    await refetch();
  };

  const activateUser = async (id) => {
    // Backend has no dedicated /activate endpoint — generic PATCH accepts isActive.
    await apiFetch(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: true }),
    });
    await refetch();
  };

  const deleteUser = async (id) => {
    await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
    await refetch();
  };

  return {
    users,
    loading,
    error,
    refetch,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
  };
}
