import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const POLL_INTERVAL_MS = 60_000;

export const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const refetch = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setError("");
    try {
      const res = await apiFetch("/notifications");
      setNotifications(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    setLoading(true);
    refetch();
    intervalRef.current = setInterval(refetch, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, refetch]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
    } catch (err) {
      refetch();
      throw err;
    }
  }, [refetch]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
    } catch (err) {
      refetch();
      throw err;
    }
  }, [refetch]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({ notifications, loading, error, unreadCount, markAsRead, markAllAsRead, refetch }),
    [notifications, loading, error, unreadCount, markAsRead, markAllAsRead, refetch]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
