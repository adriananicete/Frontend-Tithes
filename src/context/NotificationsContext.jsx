import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";
import { useAuth } from "../hooks/useAuth";

export const NotificationsContext = createContext(null);

// How often to poll for new notifications when the websocket isn't available
// (prod, behind the Vercel proxy). Tab-visibility–aware so it pauses in the
// background.
const POLL_MS = 10000;

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Ids we've already seen, so a poll can tell which notifications are new.
  const knownIdsRef = useRef(new Set());

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
      // Broadcast so resource hooks (useRequestForms / useTithes / useVouchers)
      // can refetch their list when the underlying entity changed.
      window.dispatchEvent(new CustomEvent("notification:new", { detail: notif }));
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

  // Keep the "seen" id set in sync with the current list.
  useEffect(() => {
    knownIdsRef.current = new Set(notifications.map((n) => n._id));
  }, [notifications]);

  // Polling fallback for near-realtime updates when the websocket can't be
  // used (prod behind the proxy). Each poll refreshes the bell AND re-dispatches
  // the same `notification:new` event the socket used, so list pages and the
  // dashboard's "Your Pending Work" refresh too. Pauses while the tab is hidden.
  useEffect(() => {
    if (!user) return;

    const poll = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await apiFetch("/notifications");
        const incoming = Array.isArray(res?.data) ? res.data : [];
        const known = knownIdsRef.current;
        const fresh = incoming.filter((n) => !known.has(n._id));
        knownIdsRef.current = new Set(incoming.map((n) => n._id));
        setNotifications(incoming);
        // Fire the same event the socket would, so dependent hooks refetch.
        for (const n of fresh) {
          window.dispatchEvent(new CustomEvent("notification:new", { detail: n }));
        }
      } catch {
        // Ignore — the next tick retries.
      }
    };

    const timer = setInterval(poll, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [user]);

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
