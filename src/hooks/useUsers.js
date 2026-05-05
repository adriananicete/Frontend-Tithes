import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";

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
    notifyAction("userCreated");
  };

  const updateUser = async (id, payload) => {
    await apiFetch(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await refetch();
    notifyAction("userUpdated");
  };

  const deactivateUser = async (id) => {
    await apiFetch(`/admin/users/${id}/deactivate`, { method: "PATCH" });
    await refetch();
    notifyAction("userDeactivated");
  };

  const activateUser = async (id) => {
    // Backend has no dedicated /activate endpoint — generic PATCH accepts isActive.
    await apiFetch(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: true }),
    });
    await refetch();
    notifyAction("userActivated");
  };

  const deleteUser = async (id) => {
    await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
    await refetch();
    notifyAction("userDeleted");
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
