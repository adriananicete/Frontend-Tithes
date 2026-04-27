import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";
import { useAuth } from "../hooks/useAuth";

export const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      disconnectSocket();
      return;
    }

    setLoading(true);
    refetch();

    const socket = connectSocket();
    if (!socket) return;

    const handleNew = (notif) => {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
    };

    const handleReconcile = () => {
      refetch();
    };

    socket.on("notification:new", handleNew);
    socket.on("connect", handleReconcile);
    window.addEventListener("focus", handleReconcile);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("connect", handleReconcile);
      window.removeEventListener("focus", handleReconcile);
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
